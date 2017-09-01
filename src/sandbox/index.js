import { camelizeKeys } from 'humps';
import { dispatch, isStandalone } from 'codesandbox-api';

import registerServiceWorker from 'common/registerServiceWorker';
import {
  getModulePath,
  findMainModule,
} from 'app/store/entities/sandboxes/modules/selectors';

import loadDependencies from './npm';
import host from './utils/host';

import handleExternalResources from './external-resources';
import resizeEventListener from './resize-event-listener';
import setupHistoryListeners from './url-listeners';
import resolveDependency from './eval/loaders/dependency-resolver';
import { resetScreen } from './status-screen';

import { inject, uninject } from './react-error-overlay/overlay';

import defaultBoilerplates from './boilerplates/default-boilerplates';
import {
  getBoilerplates,
  evalBoilerplates,
  findBoilerplate,
} from './boilerplates';

import Manager from './eval/manager';
import getPreset from './eval';

registerServiceWorker('/sandbox-service-worker.js');

let initializedResizeListener = false;
let loadingDependencies = false;
let manager: ?Manager = null;

function getIndexHtml(modules) {
  const module = modules.find(
    m => m.title === 'index.html' && m.directoryShortid == null
  );
  if (module) {
    return module.code;
  }
  return '<div id="root"></div>';
}

export function getCurrentManager(): ?Manager {
  return manager;
}

export function sendReady() {
  dispatch('Ready!');
}

function requestRender() {
  dispatch({ type: 'render' });
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

let actionsEnabled = false;
let updateDuringDependencyFetch = false;

export function areActionsEnabled() {
  return actionsEnabled;
}

function updateManager(sandboxId, template, module, modules, directories) {
  if (!manager || manager.id !== sandboxId) {
    manager = new Manager(sandboxId, modules, directories, getPreset(template));
    return manager.transpileModules(module).catch(e => ({ error: e }));
  }

  return manager.updateData(modules, directories).catch(e => ({ error: e }));
}

async function loadDependenciesAndSetWrapper(dependencies) {
  loadingDependencies = true;
  const result = await loadDependencies(dependencies);
  loadingDependencies = false;
  return result;
}

async function compile(message) {
  const {
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
  } = message.data;
  try {
    uninject();
  } catch (e) {
    console.error(e);
  }
  inject();

  actionsEnabled = hasActions;

  handleExternalResources(externalResources);

  try {
    if (loadingDependencies && !isStandalone) {
      updateDuringDependencyFetch = true;
      return;
    }

    const [
      { manifest, isNewCombination },
      { error: managerError },
    ] = await Promise.all([
      loadDependenciesAndSetWrapper(dependencies),
      updateManager(sandboxId, template, module, modules, directories),
    ]);

    const { externals } = manifest;
    manager.setExternals(externals);

    if (managerError) {
      throw managerError;
    }

    if (isNewCombination && updateDuringDependencyFetch && !isStandalone) {
      manager.clearCompiledCache();
      // If we just loaded new depdendencies, we want to get the latest changes,
      // since we might have missed them
      requestRender();
      updateDuringDependencyFetch = false;
      return;
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

      // Do unmounting for preact
      // if (externals['preact']) {
      //   const preact = resolveDependency('preact', externals);
      //   preact.render('', parent, document.body);
      // }
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

window.addEventListener('message', async message => {
  if (message.data.type === 'compile') {
    await compile(message);
  } else if (message.data.type === 'urlback') {
    history.back();
  } else if (message.data.type === 'urlforward') {
    history.forward();
  }
});

sendReady();

setupHistoryListeners();

if (isStandalone) {
  // We need to fetch the sandbox ourselves...
  const id = document.location.host.match(/(.*)\.codesandbox/)[1];
  window
    .fetch(`${host}/api/v1/sandboxes/${id}`)
    .then(res => res.json())
    .then(res => camelizeKeys(res))
    .then(x => {
      const mainModule = findMainModule(x.data.modules);

      const message = {
        data: {
          sandboxId: id,
          modules: x.data.modules,
          directories: x.data.directories,
          module: mainModule,
          changedModule: mainModule,
          externalResources: x.data.externalResources,
          dependencies: x.data.npmDependencies,
          hasActions: false,
          template: x.data.template,
        },
      };

      compile(message);
    });
}
