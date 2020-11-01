import { dispatch, listen } from 'codesandbox-api';

listen((data) => {
  if (data.type === 'take-screenshot') {
    import('html2canvas').then((lib) => {
      const html2canvas = lib.default
      html2canvas(document.body, {
        useCORS: true,
        logging: false
      }).then((canvas) => {
        dispatch({
          type: 'screenshot-generated',
          screenshot: canvas.toDataURL()
        })
      });
    })
  }
})