import delay from './utils/delay';
import buildError from './utils/error-message-builder';
import evalModule, { deleteCache } from './eval';
import NoDomChangeError from './errors/no-dom-change-error';

import handleExternalResources from './external-resources';

import {
  getBoilerplates,
  evalBoilerplates,
  findBoilerplate,
} from './boilerplates';

const host = process.env.NODE_ENV === 'development'
  ? 'http://codesandbox.dev'
  : 'https://codesandbox.io';

let fetching = false;
let url = null;

async function addDependencyBundle() {
  if (url !== '') {
    const script = document.createElement('script');
    script.setAttribute('src', url);
    script.setAttribute('async', false);
    document.head.appendChild(script);

    while (window.dependencies == null) {
      await delay(100);
    }
  }
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

async function compile(message) {
  const {
    modules,
    directories,
    boilerplates,
    module,
    manifest,
    url: newUrl,
    changedModule,
    externalResources,
    sandboxId,
  } = message.data;

  if (fetching) return;

  if (url == null || url !== newUrl) {
    fetching = true;
    url = newUrl;
    await addDependencyBundle();
    fetching = false;
    window.parent.postMessage('Ready!', host);
    return;
  }
  handleExternalResources(externalResources);

  try {
    const html = getIndexHtml(modules);
    document.body.innerHTML = html;
    deleteCache(sandboxId, changedModule);

    const evalled = evalModule(
      module,
      sandboxId,
      modules,
      directories,
      manifest
    );
    const domChanged = document.body.innerHTML !== html;

    if (!domChanged && !module.title.endsWith('.html')) {
      const isReact = module.code.includes('React');
      const functionName = evalled.default ? evalled.default.name : '';

      if (isReact) {
        // initiate boilerplates
        if (
          boilerplates.length !== 0 &&
          getBoilerplates().length === 0 &&
          manifest != null
        ) {
          try {
            evalBoilerplates(boilerplates, modules, directories, manifest);
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

    window.parent.postMessage(
      {
        type: 'success',
      },
      host
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
      host
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

window.parent.postMessage('Ready!', host);

function setupHistoryListeners() {
  const pushState = window.history.pushState;
  window.history.pushState = function(state) {
    if (typeof history.onpushstate === 'function') {
      window.history.onpushstate({ state });
    }
    // ... whatever else you want to do
    // maybe call onhashchange e.handler
    return pushState.apply(window.history, arguments);
  };

  const replaceState = window.history.replaceState;
  window.history.replaceState = function(state) {
    if (typeof history.onpushstate === 'function') {
      window.history.onpushstate({ state });
    }
    // ... whatever else you want to do
    // maybe call onhashchange e.handler
    return replaceState.apply(window.history, arguments);
  };

  history.onpushstate = e => {
    setTimeout(() => {
      window.parent.postMessage(
        {
          type: 'urlchange',
          url: document.location.pathname + location.search,
        },
        host
      );
    });
  };

  history.onreplacestate = e => {
    setTimeout(() => {
      window.parent.postMessage(
        {
          type: 'urlchange',
          url: document.location.pathname + location.search,
        },
        host
      );
    });
  };
}

setupHistoryListeners();
