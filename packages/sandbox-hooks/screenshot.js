import { dispatch, listen } from 'codesandbox-api';

listen(data => {
  if (data.type === 'take-screenshot') {
    import('./html2canvas-lib').then(lib => {
      const html2canvas = lib.default;

      html2canvas(document.body, {
        useCORS: (_, isSameOrigin) => !(data.data.isPrivateSandbox && isSameOrigin),
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
