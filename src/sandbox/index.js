import { camelizeKeys } from 'humps';
import { dispatch, isStandalone } from 'codesandbox-api';

import registerServiceWorker from 'common/registerServiceWorker';
import { findMainModule } from 'app/store/entities/sandboxes/modules/selectors';

import host from './utils/host';

import setupHistoryListeners from './url-listeners';
import compile from './compile';

registerServiceWorker('/sandbox-service-worker.js');

function sendReady() {
  dispatch('Ready!');
}

window.addEventListener('message', async message => {
  if (message.data.type === 'compile') {
    compile(message.data);
  } else if (message.data.type === 'urlback') {
    history.back();
  } else if (message.data.type === 'urlforward') {
    history.forward();
  }
});

sendReady();
setupHistoryListeners();

if (isStandalone) {
  // We need to fetch the sandbox ourselves...
  const id = document.location.host.match(/(.*)\.codesandbox/)[1];
  window
    .fetch(`${host}/api/v1/sandboxes/${id}`)
    .then(res => res.json())
    .then(res => camelizeKeys(res))
    .then(x => {
      const mainModule = findMainModule(x.data.modules);

      const data = {
        sandboxId: id,
        modules: x.data.modules,
        directories: x.data.directories,
        module: mainModule,
        changedModule: mainModule,
        externalResources: x.data.externalResources,
        dependencies: x.data.npmDependencies,
        hasActions: false,
        template: x.data.template,
      };

      compile(data);
    });
}
