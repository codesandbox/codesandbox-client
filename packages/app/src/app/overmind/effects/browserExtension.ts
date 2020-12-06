export default {
  install() {
    return new Promise((resolve, reject) => {
      // @ts-ignore
      chrome.webstore.install(
        'https://chrome.google.com/webstore/detail/aandnjmckilnalnkmbmodifapcedaofn',
        resolve,
        reject
      );
    });
  },
  setNotifiedImprovedScreenshots() {
    localStorage.setItem('HAS_NOTIFIED_IMPROVED_SCREENSHOTS', 'true');
  },
  hasNotifiedImprovedScreenshots() {
    return Boolean(localStorage.getItem('HAS_NOTIFIED_IMPROVED_SCREENSHOTS'));
  },
  hasExtension(): Promise<boolean> {
    return new Promise(resolve => {
      setTimeout(() => {
        let extensionTimeout;
        const listener = event => {
          if (event.data.type === 'extension-pong') {
            clearTimeout(extensionTimeout);
            window.removeEventListener('message', listener);
            resolve(true);
          }
        };
        extensionTimeout = setTimeout(() => {
          window.removeEventListener('message', listener);
          resolve(false);
        }, 1000);
        window.addEventListener('message', listener);
        window.postMessage({ type: 'extension-ping' }, '*');
      }, 3000);
    });
  },
};
