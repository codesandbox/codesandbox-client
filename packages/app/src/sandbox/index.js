import requirePolyfills from '@codesandbox/common/es/load-dynamic-polyfills';
import registerServiceWorker from '@codesandbox/common/es/registerServiceWorker';
import { getModulePath } from '@codesandbox/common/es/sandbox/modules';
import { generateFileFromSandbox } from '@codesandbox/common/es/templates/configuration/package-json';
import _debug from '@codesandbox/common/es/utils/debug';
import { getSandboxId } from '@codesandbox/common/es/utils/url-generator';
import { dispatch, isStandalone, listen } from 'codesandbox-api';
import { camelizeKeys } from 'humps';
import { show404 } from 'sandbox-hooks/not-found-screen';
import { getPreviewSecret } from 'sandbox-hooks/preview-secret';

import compile, { getCurrentManager } from './compile';
import { endMeasure } from './utils/metrics';

const host = process.env.CODESANDBOX_HOST;
const debug = _debug('cs:sandbox');

export const SCRIPT_VERSION =
  document.currentScript && document.currentScript.src;

debug('Booting sandbox v2');

endMeasure('boot', { lastTime: 0, displayName: 'Boot' });

requirePolyfills().then(() => {
  registerServiceWorker('/sandbox-service-worker.js', {});

  function sendReady() {
    dispatch({ type: 'initialized' });
  }

  async function handleMessage(data, source) {
    if (source) {
      if (data.type === 'compile') {
        compile(data);
      } else if (data.type === 'get-transpiler-context') {
        const manager = getCurrentManager();

        if (manager) {
          const context = await manager.getTranspilerContext();
          dispatch({
            type: 'transpiler-context',
            data: context,
          });
        } else {
          dispatch({
            type: 'transpiler-context',
            data: {},
          });
        }
      }
    }
  }

  if (!isStandalone) {
    listen(handleMessage);

    sendReady();
  }

  if (process.env.NODE_ENV === 'test' || isStandalone) {
    // We need to fetch the sandbox ourselves...
    const id = getSandboxId();
    window
      .fetch(host + `/api/v1/sandboxes/${id}`, {
        headers: {
          Accept: 'application/json',
          Authorization: `Basic ${getPreviewSecret()}`,
        },
        credentials: 'include',
        mode: 'cors',
      })
      .then(res => {
        if (res.status === 404) {
          show404(id);
        }
        return res.json();
      })
      .then(res => {
        const camelized = camelizeKeys(res);
        camelized.data.npmDependencies = res.data.npm_dependencies;

        return camelized;
      })
      .then(x => {
        const moduleObject = {};

        // We convert the modules to a format the manager understands
        x.data.modules.forEach(m => {
          const path = getModulePath(x.data.modules, x.data.directories, m.id);
          moduleObject[path] = {
            path,
            code: m.code,
          };
        });

        if (!moduleObject['/package.json']) {
          moduleObject['/package.json'] = {
            code: generateFileFromSandbox(x.data),
            path: '/package.json',
          };
        }

        const data = {
          sandboxId: id,
          modules: moduleObject,
          entry: '/' + x.data.entry,
          externalResources: x.data.externalResources,
          dependencies: x.data.npmDependencies,
          hasActions: false,
          template: x.data.template,
          version: 3,
          disableDependencyPreprocessing: document.location.search.includes(
            'csb-dynamic-download'
          ),
        };

        compile(data);
      });
  }
});
