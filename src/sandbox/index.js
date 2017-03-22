import delay from './utils/delay';
import buildError from './utils/error-message-builder';
import evalModule, { deleteCache } from './eval';
import {
  getBoilerplates,
  evalBoilerplates,
  findBoilerplate,
} from './boilerplates';

const host = process.env.NODE_ENV === 'development'
  ? 'http://codesandbox.dev/'
  : 'https://codesandbox.io/';

let fetching = false;
let url = null;

async function addDependencyBundle() {
  const script = document.createElement('script');
  script.setAttribute('src', url);
  script.setAttribute('async', false);
  document.head.appendChild(script);

  while (window.dependencies == null) {
    await delay(100);
  }
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

  if (
    boilerplates.length !== 0 &&
    getBoilerplates().length === 0 &&
    manifest != null
  ) {
    evalBoilerplates(boilerplates, modules, directories, manifest);
  }

  try {
    document.body.innerHTML = '';
    deleteCache(changedModule);
    const compiledModule = evalModule(module, modules, directories, manifest);

    const boilerplate = findBoilerplate(module);
    boilerplate.module.default(compiledModule);

    window.parent.postMessage(
      {
        type: 'success',
      },
      host
    );
  } catch (e) {
    if (process.env.NODE_ENV === 'development') {
      console.error(e);
    }

    window.parent.postMessage(
      {
        type: 'error',
        error: buildError(e),
      },
      '*'
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
