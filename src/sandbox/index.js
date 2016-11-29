import buildError from './utils/error-message-builder';
import evalModule from './utils/eval-module';
import ReactMode from './modes/ReactMode';
import FunctionMode from './modes/FunctionMode';

const rootElement = document.getElementById('root');

let errorHappened = false;

window.addEventListener('message', (message) => {
  const { modules, module } = message.data;
  try {
    const compiledModule = evalModule(module, modules);
    const mode = module.type; // eslint-disable-line no-underscore-dangle

    if (mode === 'react') {
      if (this.mode == null || this.mode.type !== 'react') {
        this.mode = new ReactMode(rootElement);
      }
      this.mode.render(compiledModule.default, !!errorHappened);
    } else if (mode === 'function') {
      if (this.mode == null || this.mode.type !== 'function') {
        this.mode = new FunctionMode(rootElement);
      }
      this.mode.render(compiledModule);
    } else {
      this.mode = null;
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
