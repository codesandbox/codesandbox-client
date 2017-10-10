import { dispatch, clearErrorTransformers } from 'codesandbox-api';

import { getModulePath } from 'app/store/entities/sandboxes/modules/selectors';
import type { Module, Directory } from 'common/types';
import _debug from 'app/utils/debug';

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

// Preload the babel loader
import babelWorker from './eval/transpilers/babel';

babelWorker.initialize();

let initializedResizeListener = false;
let manager: ?Manager = null;
let actionsEnabled = false;

const debug = _debug('cs:compiler');

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

async function updateManager(
  sandboxId,
  template,
  managerModules,
  experimentalPackager = false
) {
  if (!manager || manager.id !== sandboxId) {
    manager = new Manager(sandboxId, managerModules, getPreset(template), {
      experimentalPackager,
    });
  } else {
    await manager.updateData(managerModules);
  }

  return manager;
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
  experimentalPackager = false,
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
    // We convert the modules to a format the manager understands
    const managerModules = modules.map(m => ({
      path: getModulePath(modules, directories, m.id),
      code: m.code,
    }));

    const [{ manifest, isNewCombination }] = await Promise.all([
      loadDependencies(dependencies, experimentalPackager),
      updateManager(sandboxId, template, managerModules, experimentalPackager),
    ]);

    const { externals = {} } = manifest;

    if (experimentalPackager) {
      manager.setManifest(manifest);
    } else {
      manager.setExternals(externals);
    }

    if (isNewCombination) {
      manager.clearCompiledCache();
    }

    const managerModulePathToTranspile = getModulePath(
      modules,
      directories,
      module.id
    );
    const managerModuleToTranspile = managerModules.find(
      m => m.path === managerModulePathToTranspile
    );

    const t = Date.now();
    await manager.transpileModules(managerModuleToTranspile);
    debug(`Transpilation time ${Date.now() - t}ms`);

    resetScreen();

    try {
      const children = document.body.children;
      // Do unmounting for react
      if (externals['react-dom']) {
        const reactDOM = resolveDependency('react-dom', externals);
        reactDOM.unmountComponentAtNode(document.body);
        for (let i = 0; i < children.length; i += 1) {
          if (children[i].tagName === 'DIV') {
            reactDOM.unmountComponentAtNode(children[i]);
          }
        }
      }
    } catch (e) {
      /* don't do anything with this error */
    }

    const html = getIndexHtml(modules);
    document.body.innerHTML = html;

    const tt = Date.now();
    const evalled = manager.evaluateModule(managerModuleToTranspile);
    debug(`Evaluation time: ${Date.now() - tt}ms`);

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
