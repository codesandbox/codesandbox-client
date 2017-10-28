import { camelizeKeys } from 'humps';
import { isStandalone, dispatch } from 'codesandbox-api';

import registerServiceWorker from 'common/registerServiceWorker';
import requirePolyfills from 'common/load-dynamic-polyfills';
import { findMainModule } from 'app/store/entities/sandboxes/modules/selectors';

import host from './utils/host';

import setupHistoryListeners from './url-listeners';
import compile from './compile';
import setupConsole from './console';
import mapConsoleResult from './utils/map-console-result';

function getId() {
  if (process.env.NODE_ENV === 'test') {
    return document.location.hash.replace('#', '');
  }

  return document.location.host.match(/(.*)\.codesandbox/)[1];
}

requirePolyfills().then(() => {
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
    } else if (message.data.type === 'evaluate') {
      let result = null;
      let error = false;
      try {
        result = eval(message.data.command); // eslint-disable-line no-eval
      } catch (e) {
        result = e;
        error = true;
      }

      try {
        dispatch({
          type: 'eval-result',
          error,
          result: JSON.stringify(mapConsoleResult(result)),
        });
      } catch (e) {
        console.error(e);
      }
    }
  });

  sendReady();
  setupHistoryListeners();
  setupConsole();

  if (process.env.NODE_ENV === 'test' || isStandalone) {
    // We need to fetch the sandbox ourselves...
    const id = getId();
    window
      .fetch(`${host}/api/v1/sandboxes/${id}`)
      .then(res => res.json())
      .then(res => camelizeKeys(res))
      .then(x => {
        const mainModule = findMainModule(x.data.modules, x.data.template);

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
});
