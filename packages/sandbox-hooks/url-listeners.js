import { dispatch, listen } from 'codesandbox-api';

const origHistoryProto = window.history.__proto__; // eslint-disable-line no-proto
const historyList = [];
let historyPosition = -1;
let disableNextHashChange = false;

function sendUrlChange(url) {
  dispatch({
    type: 'urlchange',
    url,
    back: historyPosition > 0,
    forward: historyPosition < historyList.length - 1,
  });
}

function pushHistory(url, state) {
  // remove "future" locations
  historyList.splice(historyPosition + 1);
  historyList.push({ url, state });
  historyPosition = historyList.length - 1;
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
  Object.assign(window.history, {
    go(delta) {
      const newPos = historyPosition + delta;
      if (newPos >= 0 && newPos <= historyList.length - 1) {
        historyPosition = newPos;
        const { url, state } = historyList[historyPosition];
        const oldURL = document.location.href;
        origHistoryProto.replaceState.call(window.history, state, '', url);
        const newURL = document.location.href;
        sendUrlChange(newURL);
        window.dispatchEvent(new PopStateEvent('popstate', { state }));
        if (newURL.indexOf('#') !== -1) {
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
      sendUrlChange(document.location.href);
    },
  });

  Object.defineProperties(window.history, {
    length: {
      get() {
        return historyList.length;
      },
      configurable: true,
    },

    state: {
      get() {
        return historyList[historyPosition].state;
      },
      configurable: true,
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

  pushHistory(pathWithHash(document.location), null);

  setTimeout(() => {
    sendUrlChange(document.location.href);
  });
  return listen(handleMessage);
}
