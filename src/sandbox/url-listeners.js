import { dispatch } from 'codesandbox-api';

function sendUrlChange(url: string) {
  dispatch({
    type: 'urlchange',
    url,
  });
}

function updateUrl() {
  setTimeout(() => {
    sendUrlChange(document.location.href);
  });
}

export default function setupHistoryListeners() {
  const pushState = window.history.pushState;
  window.history.pushState = function(state, ...args) {
    if (typeof history.onpushstate === 'function') {
      window.history.onpushstate({ state });
    }
    // ... whatever else you want to do
    // maybe call onhashchange e.handler
    return pushState.apply(window.history, [state, ...args]);
  };

  const replaceState = window.history.replaceState;
  window.history.replaceState = function(state, ...args) {
    if (typeof history.onpushstate === 'function') {
      window.history.onpushstate({ state });
    }
    // ... whatever else you want to do
    // maybe call onhashchange e.handler
    return replaceState.apply(window.history, [state, ...args]);
  };

  history.onpushstate = updateUrl;

  history.onreplacestate = updateUrl;

  window.addEventListener('hashchange', updateUrl);

  setTimeout(() => {
    sendUrlChange(document.location.href);
  });
}
