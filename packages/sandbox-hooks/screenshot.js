import { dispatch, listen } from 'codesandbox-api';

export default function setupScreenshotListener() {
  listen(data => {
    if (data.type === 'take-screenshot') {
      import('./html2canvas-lib').then(lib => {
        const html2canvas = lib.default;

        html2canvas(document.body, {
          useCORS: isSameOrigin => {
            // When it is a public sandbox the image url will be redirected to a
            // cross origin url, so we need to force CORS
            if (!data.data.isPrivateSandbox && isSameOrigin) {
              return true;
            }

            // By default we do not use cors, which means cross origin images will use the proxy
            return false;
          },
          proxy: 'https://h2c-proxy.csb.dev/',
          logging: false,
          allowTaint: false,
        }).then(canvas => {
          dispatch({
            type: 'screenshot-generated',
            screenshot: canvas.toDataURL(),
          });
        });
      });
    }
  });

  const listener = event => {
    if (
      event.key === 's' &&
      event.shiftKey &&
      (event.metaKey || event.ctrlKey)
    ) {
      event.preventDefault();
      dispatch({
        type: 'screenshot-requested-from-preview',
      });
    }
  };
  window.addEventListener('keydown', listener);
}
