import delay from './utils/delay';
import buildError from './utils/error-message-builder';
import evalModule, { deleteCache } from './eval';
import NoDomChangeError from './errors/no-dom-change-error';
import host from './utils/host';

import handleExternalResources from './external-resources';
import resizeEventListener from './resize-event-listener';
import setupHistoryListeners from './url-listeners';

import {
  getBoilerplates,
  evalBoilerplates,
  findBoilerplate,
} from './boilerplates';

let fetching = false;
let url = null;
let initializedResizeListener = false;

async function addDependencyBundle() {
  if (url !== '') {
    window.dll_bundle = null;
    const script = document.createElement('script');
    script.setAttribute('src', `${url}/dll.js`);
    script.setAttribute('async', false);
    document.head.appendChild(script);

    while (window.dll_bundle == null) {
      await delay(100);
    }
  }
}

function getIndexHtml(modules) {
  const module = modules.find(
    m => m.title === 'index.html' && m.directoryShortid == null,
  );
  if (module) {
    return module.code;
  }
  return '<div id="root"></div>';
}

function sendReady() {
  window.parent.postMessage('Ready!', host);
}

function initializeResizeListener() {
  const listener = resizeEventListener();
  listener.addResizeListener(document.body, () => {
    if (document.body) {
      window.parent.postMessage(
        {
          type: 'resize',
          height: document.body.getBoundingClientRect().height,
        },
        '*',
      );
    }
  });
  initializedResizeListener = true;
}

async function compile(message) {
  const {
    modules,
    directories,
    boilerplates,
    module,
    externals,
    url: newUrl,
    changedModule,
    externalResources,
  } = message.data;

  if (fetching) return;

  handleExternalResources(externalResources);
  if (url == null || url !== newUrl) {
    fetching = true;
    url = newUrl;
    await addDependencyBundle();
    fetching = false;
    sendReady();
    return;
  }

  try {
    const html = getIndexHtml(modules);
    document.body.innerHTML = html;
    deleteCache(changedModule);

    const evalled = evalModule(module, modules, directories, externals);
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
      } else {
        throw new NoDomChangeError(isReact, functionName);
      }
    }

    if (!initializedResizeListener) {
      initializeResizeListener();
    }

    window.parent.postMessage(
      {
        type: 'success',
      },
      host,
    );
  } catch (e) {
    console.log('Error in sandbox:');
    console.error(e);

    e.module = e.module || changedModule;

    window.parent.postMessage(
      {
        type: 'error',
        error: buildError(e),
      },
      host,
    );
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
