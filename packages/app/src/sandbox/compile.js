import { dispatch, clearErrorTransformers } from 'codesandbox-api';

import _debug from 'app/utils/debug';

import initializeErrorTransformers from './errors/transformers';
import getPreset from './eval';
import Manager from './eval/manager';

import { resetScreen } from './status-screen';

import { inject, unmount } from './react-error-overlay/overlay';
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

const debug = _debug('cs:compiler');

export function areActionsEnabled() {
  return actionsEnabled;
}

export function getCurrentManager(): ?Manager {
  return manager;
}

async function updateManager(sandboxId, template, managerModules) {
  if (!manager || manager.id !== sandboxId) {
    manager = new Manager(sandboxId, managerModules, getPreset(template));
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
inject();

async function compile({
  sandboxId,
  modules,
  entry,
  externalResources,
  dependencies,
  hasActions,
  isModuleView = false,
  template,
}) {
  try {
    clearErrorTransformers();
    initializeErrorTransformers();
    unmount();
  } catch (e) {
    console.error(e);
  }

  actionsEnabled = hasActions;
  handleExternalResources(externalResources);

  try {
    const [{ manifest, isNewCombination }] = await Promise.all([
      loadDependencies(dependencies),
      updateManager(sandboxId, template, modules),
    ]);

    // Just reset the whole packager if it's a new combination
    if (isNewCombination) {
      manager = null;
      await updateManager(sandboxId, template, modules);
    }

    manager.setManifest(manifest);

    const managerModuleToTranspile = modules.find(m => m.path === entry);

    const t = Date.now();
    await manager.transpileModules(managerModuleToTranspile);
    debug(`Transpilation time ${Date.now() - t}ms`);

    resetScreen();

    try {
      const children = document.body.children;
      // Do unmounting for react
      if (manifest.dependencies.find(n => n.name === 'react-dom')) {
        const reactDOMModule = manager.resolveModule('react-dom', '');
        const reactDOM = manager.evaluateModule(reactDOMModule);

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

    const htmlModule = modules.find(
      m => m.path === '/public/index.html' || m.path === '/index.html'
    );
    const html = htmlModule ? htmlModule.code : '<div id="root"></div>';

    document.body.innerHTML = html;

    const tt = Date.now();
    const oldHTML = document.body.innerHTML;
    const evalled = manager.evaluateModule(managerModuleToTranspile);
    debug(`Evaluation time: ${Date.now() - tt}ms`);
    const domChanged = oldHTML !== document.body.innerHTML;

    if (isModuleView && !domChanged && !module.title.endsWith('.html')) {
      const isReact = module.code && module.code.includes('React');

      if (isReact) {
        // initiate boilerplates
        if (getBoilerplates().length === 0) {
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

    if (typeof window.__puppeteer__ === 'function') {
      window.__puppeteer__('done');
    }

    dispatch({
      type: 'success',
    });
  } catch (e) {
    console.log('Error in sandbox:');
    console.error(e);

    e.module = e.module;
    e.fileName = e.fileName || entry;

    const event = new Event('error');
    event.error = e;

    window.dispatchEvent(event);
  }
}

type Arguments = {
  sandboxId: string,
  modules: Array<{
    code: string,
    path: string,
  }>,
  entry: string,
  externalResources: Array<string>,
  dependencies: Object,
  hasActions: boolean,
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
