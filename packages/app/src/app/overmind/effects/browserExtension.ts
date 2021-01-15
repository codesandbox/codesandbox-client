export default {
  install() {
    return new Promise<void>(resolve => {
      const win = window.open(
        'https://chrome.google.com/webstore/detail/hdidglkcgdolpoijdckmafdnddjoglia',
        'CodeSandbox Extension',
        'directories=no,titlebar=no,toolbar=no,location=no,status=no,menubar=no,scrollbars=no,resizable=no,width=1100,height=300'
      );
      const interval = setInterval(() => {
        if (win && win.closed) {
          clearInterval(interval);
          resolve();
        }
      }, 500);
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
