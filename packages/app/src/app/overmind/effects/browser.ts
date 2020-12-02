function getPopupOffset({ width, height }) {
  const wLeft = window.screenLeft ? window.screenLeft : window.screenX;
  const wTop = window.screenTop ? window.screenTop : window.screenY;

  const left = wLeft + window.innerWidth / 2 - width / 2;
  const top = wTop + window.innerHeight / 2 - height / 2;

  return { top, left };
}

function getPopupSize() {
  return { width: 1020, height: 618 };
}

function getPopupDimensions() {
  const { width, height } = getPopupSize();
  const { top, left } = getPopupOffset({ width, height });

  return `width=${width},height=${height},top=${top},left=${left}`;
}

export default {
  setTitle(title) {
    document.title = title;
  },
  alert(message) {
    return alert(message); // eslint-disable-line no-alert
  },
  confirm(message) {
    return confirm(message); // eslint-disable-line no-alert,no-restricted-globals
  },
  onUnload(cb) {
    window.addEventListener('beforeunload', cb);
  },
  openWindow(url) {
    window.open(url, '_blank');
  },
  getWidth() {
    return window.innerWidth;
  },
  getHeight() {
    return window.innerHeight;
  },
  openPopup(url, name) {
    const popup = window.open(
      url,
      name,
      `scrollbars=no,toolbar=no,location=no,titlebar=no,directories=no,status=no,menubar=no, ${getPopupDimensions()}`
    );
    return {
      close: () => popup?.close(),
    };
  },
  copyToClipboard: (str: string) => {
    const el = document.createElement('textarea');
    el.value = str;
    el.setAttribute('readonly', '');
    el.style.position = 'absolute';
    el.style.left = '-9999px';
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
  },
  waitForMessage<T>(type): Promise<T> {
    return new Promise(resolve => {
      window.addEventListener('message', function onMessage(event) {
        if (event.data.type === type) {
          window.removeEventListener('message', onMessage);
          resolve(event.data.data);
        }
      });
    });
  },
  reload() {
    location.reload(true);
  },
  storage: {
    get(key: string): unknown | null {
      const value = localStorage.getItem(key);

      if (value) {
        return JSON.parse(value);
      }

      return null;
    },
    set(key: string, value: any) {
      localStorage.setItem(key, JSON.stringify(value));
    },
  },
  /**
   * Wait at least MS before resolving the value
   */
  waitAtLeast<T>(ms: number, cb: () => Promise<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      let resolveValue: T;
      setTimeout(() => {
        if (!resolveValue) {
          return;
        }
        resolve(resolveValue);
      }, ms);
      const startTime = Date.now();
      cb()
        .then(value => {
          resolveValue = value;
          if (Date.now() - startTime > ms) {
            resolve(resolveValue);
          }
        })
        .catch(reject);
    });
  },
  getUserAgent() {
    return navigator.userAgent;
  },
  getElementBoundingRect(elementId: string): DOMRect | null {
    const el = document.querySelector(elementId);

    if (!el) {
      return null;
    }

    return el.getBoundingClientRect();
  },
};
