import delay from './utils/delay';
import buildError from './utils/error-message-builder';
import evalModule from './utils/eval-module';
import ReactMode from './modes/ReactMode';

let errorHappened = false;
let lastMode = null;
const rootElement = document.createElement('div');
let url = null;
document.body.appendChild(rootElement);

async function addDependencyBundle() {
  const script = document.createElement('script');
  script.setAttribute('src', url);
  script.setAttribute('async', false);
  document.body.appendChild(script);

  while (window.dependencies == null) {
    await delay(100);
  }
}

window.addEventListener('message', async (message) => {
  const { modules, directories, module, manifest, url: newUrl } = message.data;

  if (url == null || url !== newUrl) {
    url = newUrl;
    await addDependencyBundle();
  }

  try {
    const compiledModule = evalModule(module, modules, directories, manifest);
    const mode = module.type; // eslint-disable-line no-underscore-dangle

    if (lastMode == null || lastMode.type !== mode) {
      while (rootElement.hasChildNodes()) {
        rootElement.removeChild(rootElement.lastChild);
      }
    }

    if (mode === 'react') {
      if (lastMode == null || lastMode.type !== 'react') {
        // Use the functions of the dependencies
        const React = window.dependencies(manifest.react.id);
        const ReactDOM = window.dependencies(manifest['react-dom'].id);
        lastMode = new ReactMode(rootElement, React, ReactDOM);
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
    console.error(e);
    errorHappened = true;
    window.parent.postMessage({
      type: 'error',
      error: buildError(e),
    }, '*');
  }
});

window.parent.postMessage('Ready!', '*');
