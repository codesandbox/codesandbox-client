import { camelizeKeys } from 'humps';

import registerServiceWorker from 'common/registerServiceWorker';
import {
  getModulePath,
  findMainModule,
} from 'app/store/entities/sandboxes/modules/selectors';

import evalModule, { deleteCache, clearCache } from './eval';
import NoDomChangeError from './errors/no-dom-change-error';
import loadDependencies from './npm';
import sendMessage, { isStandalone } from './utils/send-message';
import host from './utils/host';

import handleExternalResources from './external-resources';
import resizeEventListener from './resize-event-listener';
import setupHistoryListeners from './url-listeners';
import resolveDependency from './eval/js/dependency-resolver';
import { resetScreen } from './status-screen';

import { inject, uninject } from './react-error-overlay/overlay';

import {
  getBoilerplates,
  evalBoilerplates,
  findBoilerplate,
} from './boilerplates';

registerServiceWorker('/sandbox-service-worker.js');

let initializedResizeListener = false;
let loadingDependencies = false;

function getIndexHtml(modules) {
  const module = modules.find(
    m => m.title === 'index.html' && m.directoryShortid == null,
  );
  if (module) {
    return module.code;
  }
  return '<div id="root"></div>';
}

export function sendReady() {
  sendMessage('Ready!');
}

function requestRender() {
  sendMessage({ type: 'render' });
}

function initializeResizeListener() {
  const listener = resizeEventListener();
  listener.addResizeListener(document.body, () => {
    if (document.body) {
      sendMessage({
        type: 'resize',
        height: document.body.getBoundingClientRect().height,
      });
    }
  });
  initializedResizeListener = true;
}

let actionsEnabled = false;

export function areActionsEnabled() {
  return actionsEnabled;
}

async function compile(message) {
  const {
    modules,
    directories,
    boilerplates = [],
    module,
    changedModule,
    externalResources,
    dependencies,
    hasActions,
  } = message.data;
  uninject();
  inject();

  actionsEnabled = hasActions;

  handleExternalResources(externalResources);

  if (loadingDependencies && !isStandalone) return;

  loadingDependencies = true;
  const { manifest, isNewCombination } = await loadDependencies(dependencies);
  loadingDependencies = false;

  if (isNewCombination && !isStandalone) {
    clearCache();
    // If we just loaded new depdendencies, we want to get the latest changes,
    // since we might have missed them
    requestRender();
    return;
  }

  resetScreen();
  const { externals } = manifest;

  // Do unmounting
  try {
    if (externals['react-dom']) {
      const reactDOM = resolveDependency('react-dom', externals);
      reactDOM.unmountComponentAtNode(document.body);
      const children = document.body.children;
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
    console.error(e);
  }

  try {
    const html = getIndexHtml(modules);
    document.body.innerHTML = html;
    deleteCache(changedModule);

    const evalled = await evalModule(module, modules, directories, externals);
    const domChanged = document.body.innerHTML !== html;

    if (!domChanged && !module.title.endsWith('.html')) {
      const isReact = module.code && module.code.includes('React');
      const functionName = evalled.default ? evalled.default.name : '';

      if (isReact) {
        // initiate boilerplates
        if (
          boilerplates.length !== 0 &&
          getBoilerplates().length === 0 &&
          externals != null
        ) {
          try {
            evalBoilerplates(boilerplates, modules, directories, externals);
          } catch (e) {
            console.log("Couldn't load all boilerplates");
          }
        }

        const boilerplate = findBoilerplate(module);
        if (boilerplate) {
          try {
            boilerplate.module.default(evalled);
          } catch (e) {
            throw new NoDomChangeError(isReact, functionName);
          }
        }
      }
    }

    if (!initializedResizeListener) {
      initializeResizeListener();
    }

    sendMessage({
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
          modules: x.data.modules,
          directories: x.data.directories,
          module: mainModule,
          changedModule: mainModule,
          externalResources: x.data.externalResources,
          dependencies: x.data.npmDependencies,
          hasActions: false,
        },
      };

      compile(message);
    });
}
