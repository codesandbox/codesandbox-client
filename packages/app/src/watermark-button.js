const buttonStyles = `
  display: inline-flex;
  align-items: center;
  height: 32px;
  padding: 0 12px;
  font-size: 13px;
  font-weight: 500;
  color: white;
  background-color: rgb(21, 21, 21);
  cursor: pointer;
  border: 1px solid rgb(52,52,52);
  border-radius: 4px;
  text-decoration: none;
  font-family: system-ui,-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Ubuntu,Droid Sans,Helvetica Neue,sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: antialiased;
  z-index: 99999999999;
`;

const setButtonStyles = button => {
  button.setAttribute('style', buttonStyles);
};

const setIframeStyle = iframe => {
  iframe.setAttribute(
    'style',
    `
      position: fixed;
      margin: 0;
      padding: 0;
      bottom: 16px;
      right: 16px;
      border: none;
      width: 118px;
      height: 36px;
      z-index: 9999999999999;
    `
  );

  iframe.addEventListener('load', () => {
    iframe.contentDocument.body.setAttribute('style', `margin: 0;`);
  });
};

function isStandalone() {
  if (typeof window === 'undefined') {
    return true;
  }

  if (window.location && window.location.href.indexOf('?standalone') > -1) {
    return true;
  }

  return !window.opener && window.parent === window;
}

const createIframe = () => {
  if (!isStandalone()) {
    return;
  }

  const iframe = document.createElement('iframe');
  iframe.setAttribute('id', 'open-sandbox');
  const link = document.createElement('a');
  setIframeStyle(iframe);

  iframe.onload = () => {
    iframe.contentDocument.body.appendChild(link);
    setButtonStyles(link);
    link.innerText = 'Open Sandbox';

    link.href =
      'https://codesandbox.io/s/' + document.location.host.split('.')[0];
    link.target = '_blank';
    link.rel = 'noopener noreferrer';

    /**
     * Prevent others from trying to remove this button. If it's removed we just
     * readd it!
     */
    const observer = new MutationObserver(() => {
      document.body.removeChild(iframe);
      observer.disconnect();
      createIframe();
    });

    observer.observe(iframe, {
      attributes: true,
      childList: true,
      subtree: true,
    });
  };

  document.body.appendChild(iframe);
};

createIframe();
