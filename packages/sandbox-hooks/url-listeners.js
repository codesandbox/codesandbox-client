import { dispatch, isStandalone, listen } from 'codesandbox-api';

function sendUrlChange(url: string, action?: string, diff?: number) {
  dispatch({
    type: 'urlchange',
    url,
    diff,
    action,
  });
}

/* eslint-disable no-console */

const origHistoryProto = window.history.__proto__; // eslint-disable-line no-proto
const historyList = [];
let historyPosition = -1;
let disableNextHashChange = false;

function pushHistory(url, state) {
  historyPosition += 1;
  historyList.length = historyPosition + 1;
  historyList[historyPosition] = { url, state };
}

function pathWithHash(location) {
  return `${location.pathname}${location.hash}`;
}

export default function setupHistoryListeners() {
  function handleMessage(data, source) {
    if (source) {
      if (data.type === 'urlback') {
        history.back();
      } else if (data.type === 'urlforward') {
        history.forward();
      } else if (data.type === 'refresh') {
        document.location.reload();
      }
    }
  }
  if (!isStandalone) {
    Object.assign(window.history, {
      go(delta) {
        const newPos = historyPosition + delta;
        if (newPos >= 0 && newPos <= historyList.length - 1) {
          historyPosition = newPos;
          const { url, state } = historyList[historyPosition];
          const oldURL = document.location.href;
          origHistoryProto.replaceState.call(window.history, state, '', url);
          const newURL = document.location.href;
          sendUrlChange(newURL, 'POP', delta);
          if (newURL.indexOf('#') === -1) {
            window.dispatchEvent(new PopStateEvent('popstate', { state }));
          } else {
            disableNextHashChange = true;
            window.dispatchEvent(
              new HashChangeEvent('hashchange', { oldURL, newURL })
            );
          }
        }
      },

      back() {
        window.history.go(-1);
      },

      forward() {
        window.history.go(1);
      },

      pushState(state, title, url) {
        origHistoryProto.replaceState.call(window.history, state, title, url);
        pushHistory(url, state);
        sendUrlChange(document.location.href);
      },

      replaceState(state, title, url) {
        origHistoryProto.replaceState.call(window.history, state, title, url);
        historyList[historyPosition] = { state, url };
        sendUrlChange(document.location.href, 'REPLACE');
      },
    });

    Object.defineProperties(window.history, {
      length: {
        get() {
          return historyList.length;
        },
      },

      state: {
        get() {
          return historyList[historyPosition].state;
        },
      },
    });

    window.addEventListener('hashchange', () => {
      if (!disableNextHashChange) {
        const url = pathWithHash(document.location);
        pushHistory(url, null);
        sendUrlChange(document.location.href);
      } else {
        disableNextHashChange = false;
      }
    });

    document.addEventListener(
      'click',
      ev => {
        const el = ev.target;
        if (
          el.nodeName === 'A' &&
          !el.__vue__ && // workaround for vue-router <router-link>
          el.href.indexOf('#') !== -1 &&
          el.href.substr(-1) !== '#'
        ) {
          const url = el.href;
          const oldURL = document.location.href;
          origHistoryProto.replaceState.call(window.history, null, '', url);
          const newURL = document.location.href;
          if (oldURL !== newURL) {
            disableNextHashChange = true;
            window.dispatchEvent(
              new HashChangeEvent('hashchange', { oldURL, newURL })
            );
            pushHistory(pathWithHash(document.location), null);
            sendUrlChange(document.location.href);
          }
          ev.preventDefault();
          ev.stopPropagation();
        }
      },
      true
    );

    pushHistory(pathWithHash(document.location), null);

    setTimeout(() => {
      sendUrlChange(document.location.href, 'REPLACE');
    });
  }
  return listen(handleMessage);
}
