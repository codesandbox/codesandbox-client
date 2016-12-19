import buildError from './utils/error-message-builder';
import evalModule from './utils/eval-module';
import ReactMode from './modes/ReactMode';

let errorHappened = false;
let lastMode = null;
const rootElement = document.createElement('div');
document.body.appendChild(rootElement);

window.addEventListener('message', (message) => {
  const { modules, directories, module } = message.data;

  try {
    const compiledModule = evalModule(module, modules, directories);
    const mode = module.type; // eslint-disable-line no-underscore-dangle

    if (lastMode == null || lastMode.type !== mode) {
      while (rootElement.hasChildNodes()) {
        rootElement.removeChild(rootElement.lastChild);
      }
    }

    if (mode === 'react') {
      if (lastMode == null || lastMode.type !== 'react') {
        lastMode = new ReactMode(rootElement);
      }
      lastMode.render(compiledModule.default, !!errorHappened);
    } else {
      lastMode = null;
    }

    errorHappened = false;
    window.parent.postMessage({
      type: 'success',
    }, '*');
  } catch (e) {
    errorHappened = true;
    window.parent.postMessage({
      type: 'error',
      error: buildError(e),
    }, '*');
  }
});

window.parent.postMessage('Ready!', '*');
