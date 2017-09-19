import { dispatch, clearErrorTransformers } from 'codesandbox-api';

import { getModulePath } from 'app/store/entities/sandboxes/modules/selectors';
import type { Module, Directory } from 'common/types';

import initializeErrorTransformers from './errors/transformers';
import getPreset from './eval';
import Manager from './eval/manager';
import resolveDependency from './eval/loaders/dependency-resolver';

import { resetScreen } from './status-screen';

import { inject, uninject } from './react-error-overlay/overlay';
import handleExternalResources from './external-resources';

import defaultBoilerplates from './boilerplates/default-boilerplates';
import resizeEventListener from './resize-event-listener';
import {
  getBoilerplates,
  evalBoilerplates,
  findBoilerplate,
} from './boilerplates';

import loadDependencies from './npm';

let initializedResizeListener = false;
let manager: ?Manager = null;
let actionsEnabled = false;

export function areActionsEnabled() {
  return actionsEnabled;
}

export function getCurrentManager(): ?Manager {
  return manager;
}

function getIndexHtml(modules) {
  const module = modules.find(
    m => m.title === 'index.html' && m.directoryShortid == null
  );
  if (module) {
    return module.code;
  }
  return '<div id="root"></div>';
}

function updateManager(sandboxId, template, module, modules, directories) {
  if (!manager || manager.id !== sandboxId) {
    manager = new Manager(sandboxId, modules, directories, getPreset(template));
    return manager.transpileModules(module).catch(e => ({ error: e }));
  }

  return manager
    .updateData(modules, directories)
    .then(() => manager.transpileModules(module)) // We need to transpile the module if it was never an entry
    .catch(e => ({ error: e }));
}

function initializeResizeListener() {
  const listener = resizeEventListener();
  listener.addResizeListener(document.body, () => {
    if (document.body) {
      dispatch({
        type: 'resize',
        height: document.body.getBoundingClientRect().height,
      });
    }
  });
  initializedResizeListener = true;
}

async function compile({
  sandboxId,
  modules,
  directories,
  module,
  changedModule,
  externalResources,
  dependencies,
  hasActions,
  isModuleView = false,
  template,
}) {
  try {
    clearErrorTransformers();
    initializeErrorTransformers();
    uninject();
    inject();
  } catch (e) {
    console.error(e);
  }

  actionsEnabled = hasActions;
  handleExternalResources(externalResources);

  try {
    const [{ manifest }, { error: managerError }] = await Promise.all([
      loadDependencies(dependencies),
      updateManager(sandboxId, template, module, modules, directories),
    ]);

    const { externals = {} } = manifest;
    manager.setExternals(externals);

    if (managerError) {
      throw managerError;
    }

    resetScreen();

    try {
      const children = document.body.children;
      // Do unmounting for react
      if (externals['react-dom']) {
        const reactDOM = resolveDependency('react-dom', externals);
        reactDOM.unmountComponentAtNode(document.body);
        for (const child in children) {
          if (
            children.hasOwnProperty(child) &&
            children[child].tagName === 'DIV'
          ) {
            reactDOM.unmountComponentAtNode(children[child]);
          }
        }
      }
    } catch (e) {
      /* don't do anything with this error */
    }

    const html = getIndexHtml(modules);
    document.body.innerHTML = html;

    const evalled = manager.evaluateModule(module);

    const domChanged = document.body.innerHTML !== html;

    if (isModuleView && !domChanged && !module.title.endsWith('.html')) {
      const isReact = module.code && module.code.includes('React');

      if (isReact) {
        // initiate boilerplates
        if (getBoilerplates().length === 0 && externals != null) {
          try {
            await evalBoilerplates(defaultBoilerplates);
          } catch (e) {
            console.log("Couldn't load all boilerplates");
          }
        }

        const boilerplate = findBoilerplate(module);
        if (boilerplate) {
          try {
            boilerplate.module.default(evalled);
          } catch (e) {
            console.error(e);
          }
        }
      }
    }

    if (!initializedResizeListener) {
      initializeResizeListener();
    }

    dispatch({
      type: 'success',
    });
  } catch (e) {
    if (manager) {
      manager.clearCompiledCache();
    }
    console.log('Error in sandbox:');
    console.error(e);

    e.module = e.module || changedModule;
    e.fileName = e.fileName || getModulePath(modules, directories, e.module);

    const event = new Event('error');
    event.error = e;

    window.dispatchEvent(event);
  }
}

type Arguments = {
  sandboxId: string,
  modules: Array<Module>,
  directories: Array<Directory>,
  module: Module,
  changedModule: Module,
  externalResources: Array<string>,
  dependencies: Object,
  hasActions: boolean,
  isModuleView: boolean,
  template: string,
};

const tasks: Array<Arguments> = [];
let runningTask = false;

async function executeTaskIfAvailable() {
  if (tasks.length) {
    const task = tasks.pop();

    runningTask = true;
    await compile(task);
    runningTask = false;

    executeTaskIfAvailable();
  }
}

/**
 * We want to ensure that no tasks (commands from the editor) are run in parallel,
 * this could result in state inconsistency. That's why we execute tasks after eachother,
 * and if there are 3 tasks we will remove the second task, this one is unnecessary as it is not the
 * latest version.
 */
export default function queueTask(data: Arguments) {
  tasks[0] = data;

  if (!runningTask) {
    executeTaskIfAvailable();
  }
}
