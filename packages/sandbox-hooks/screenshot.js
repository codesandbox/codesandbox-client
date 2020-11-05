import { dispatch, listen } from 'codesandbox-api';

listen(data => {
  if (data.type === 'take-screenshot') {
    import('html2canvas').then(lib => {
      const html2canvas = lib.default;

      html2canvas(document.body, {
        useCORS: true,
        logging: false,
        allowTaint: false,
        // proxy: 'http://localhost:3002'
      }).then(canvas => {
        let didICreateIt = false;
        try {
          const screenshot = canvas.toDataURL();
          didICreateIt = true;
          dispatch({
            type: 'screenshot-generated',
            screenshot,
          });
        } catch (error) {
          console.error(error, didICreateIt);
        }
      });
    });
  }
});
