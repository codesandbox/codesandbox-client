import delay from './utils/delay';
import buildError from './utils/error-message-builder';
import evalModule from './eval';
import { getBoilerplates, evalBoilerplates, findBoilerplate } from './boilerplates';

let errorHappened = false;
let fetching = false;
let url = null;

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
  const { modules, directories, boilerplates, module, manifest, url: newUrl } = message.data;

  if (fetching) return;

  if (url == null || url !== newUrl) {
    fetching = true;
    url = newUrl;
    await addDependencyBundle();
    fetching = false;
    window.parent.postMessage('Ready!', '*');
    return;
  }

  if (boilerplates.length !== 0 && getBoilerplates().length === 0 && manifest != null) {
    evalBoilerplates(boilerplates, modules, directories, manifest);
  }

  try {
    document.body.innerHTML = '';
    document.head.innerHTML = '';
    const compiledModule = evalModule(module, modules, directories, manifest);

    const boilerplate = findBoilerplate(module);
    boilerplate.module.default(compiledModule);

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
