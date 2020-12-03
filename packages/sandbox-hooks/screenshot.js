import { dispatch, listen } from 'codesandbox-api';

export default function setupScreenshotListener() {
  listen(data => {
    if (data.type === 'take-screenshot') {
      import('./html2canvas-lib').then(lib => {
        const html2canvas = lib.default;

        html2canvas(document.body, {
          useCORS: (_, isSameOrigin) => {
            // When it is a public sandbox the image url will be redirected to a
            // cross origin url, so we need to force CORS
            if (!data.data.isPrivateSandbox && isSameOrigin) {
              return true;
            }

            // By default we use CORS if the url is not the same origin
            return !isSameOrigin;
          },
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
}
