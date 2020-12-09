import { dispatch, listen } from 'codesandbox-api';

export default function setupScreenshotListener() {
  let existingCursor;
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
    } else if (data.type === 'show-screenshot-cursor') {
      existingCursor = document.body.style.cursor;
      document.body.style.cursor = `url('data:image/svg+xml;utf8,<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M0 8C0 3.58172 3.58172 0 8 0C12.4183 0 16 3.58172 16 8C16 12.4183 12.4183 16 8 16H0V8Z" fill="%23FF3B30"/></svg>'), auto`;
    } else if (data.type === 'hide-screenshot-cursor') {
      document.body.style.cursor = existingCursor;
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
