import { dispatch, listen } from 'codesandbox-api';

export default function setupScreenshotListener() {
  listen(data => {
    if (data.type === 'take-screenshot') {
      import('./html2canvas-lib').then(lib => {
        const html2canvas = lib.default;

        html2canvas(document.body, {
          // When the sandbox is public we redirect same origin requests to other origins,
          // which means we need to force the CORS attribute. This removes cookies, but no worries,
          // it is a public sandbox. In private sandboxes same origin requests does indeed go to
          // same origin, where we need the cookie, so no CORS being set there
          useCORS: (_, isSameOrigin) =>
            !(data.data.isPrivateSandbox && isSameOrigin),
          logging: false,
          allowTaint: false,
          foreignObjectRendering: true,
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
