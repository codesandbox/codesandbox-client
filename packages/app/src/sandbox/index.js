import { camelizeKeys } from 'humps';
import { isStandalone, listen, dispatch } from 'codesandbox-api';

import registerServiceWorker from 'common/registerServiceWorker';
import requirePolyfills from 'common/load-dynamic-polyfills';
import { findMainModule } from 'app/store/entities/sandboxes/modules/selectors';

import setupHistoryListeners from './url-listeners';
import compile from './compile';
import setupConsole from './console';
import transformJSON from './console/transform-json';

const host = process.env.CODESANDBOX_HOST;

function getId() {
  if (process.env.LOCAL_SERVER) {
    return document.location.hash.replace('#', '');
  }

  if (process.env.STAGING) {
    const segments = host.split('//')[1].split('.');
    const first = segments.shift();
    const re = RegExp(`${first}-(.*)\\.${segments.join('\\.')}`);
    return document.location.host.match(re)[1];
  }

  return document.location.host.match(/(.*)\.codesandbox/)[1];
}

requirePolyfills().then(() => {
  registerServiceWorker('/sandbox-service-worker.js');

  function sendReady() {
    dispatch({ type: 'initialized' });
  }

  function handleMessage(data, source) {
    if (source) {
      if (data.type === 'compile') {
        compile(data);
      } else if (data.type === 'urlback') {
        history.back();
      } else if (data.type === 'urlforward') {
        history.forward();
      } else if (data.type === 'evaluate') {
        let result = null;
        let error = false;
        try {
          result = (0, eval)(data.command); // eslint-disable-line no-eval
        } catch (e) {
          result = e;
          error = true;
        }

        try {
          dispatch({
            type: 'eval-result',
            error,
            result: transformJSON(result),
          });
        } catch (e) {
          console.error(e);
        }
      }
    }
  }

  listen(handleMessage);

  sendReady();
  setupHistoryListeners();
  setupConsole();

  if (process.env.NODE_ENV === 'test' || isStandalone) {
    // We need to fetch the sandbox ourselves...
    const id = getId();
    window
      .fetch(host + `/api/v1/sandboxes/${id}`)
      .then(res => res.json())
      .then(res => {
        const camelized = camelizeKeys(res);
        camelized.data.npmDependencies = res.data.npm_dependencies;

        return camelized;
      })
      .then(x => {
        const mainModule = findMainModule(
          x.data.modules,
          x.data.directories,
          x.data.entry
        );

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
