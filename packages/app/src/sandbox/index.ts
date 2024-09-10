import { camelizeKeys } from 'humps';
import { isStandalone, listen, dispatch } from 'codesandbox-api';
import _debug from '@codesandbox/common/lib/utils/debug';

import registerServiceWorker from '@codesandbox/common/lib/registerServiceWorker';
import requirePolyfills from '@codesandbox/common/lib/load-dynamic-polyfills';
import { getModulePath } from '@codesandbox/common/lib/sandbox/modules';
import { endMeasure } from '@codesandbox/common/lib/utils/metrics';
import { generateFileFromSandbox } from '@codesandbox/common/lib/templates/configuration/package-json';
import { getSandboxId } from '@codesandbox/common/lib/utils/url-generator';
import { getPreviewSecret } from 'sandbox-hooks/preview-secret';
import { show404 } from 'sandbox-hooks/not-found-screen';

import {
  requestSandpackSecretFromApp,
  removeSandpackSecret,
} from 'sandpack-core/lib/sandpack-secret';
import compile, { getCurrentManager } from './compile';

const withServiceWorker = !process.env.SANDPACK;
const debug = _debug('cs:sandbox');

export const SCRIPT_VERSION =
  // @ts-ignore
  document.currentScript && document.currentScript.src;

debug('Booting sandbox v2');

endMeasure('boot', { lastTime: 0, displayName: 'Boot' });

requirePolyfills().then(() => {
  if (withServiceWorker) {
    registerServiceWorker('/sandbox-service-worker.js', {});
  }

  function sendReady() {
    dispatch({ type: 'initialized', url: document.location.href });
  }

  let isInitializationCompile = true;
  async function handleMessage(data, source) {
    if (source) {
      if (data.type === 'compile') {
        // In sandpack we always broadcast a compile message from every manager whenever 1 frame reconnects.
        // We do this because the initialized message does comes before the handshake is done, so there's no channel id.
        // To prevent every mounted frame from recompiling, we explicitly flag that this compilation is meant to be the
        // first compilation done by the frame. This way we can ensure that only the new frame, that
        // hasn't compiled yet, will respond to the compile call. This currently is Sandpack specific.
        if (
          data.isInitializationCompile !== undefined &&
          data.isInitializationCompile === true &&
          !isInitializationCompile
        ) {
          return;
        }

        compile(data);
        isInitializationCompile = false;
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
      } else if (data.type === 'get-modules') {
        const manager = getCurrentManager();

        if (manager) {
          dispatch({
            type: 'all-modules',
            data: manager.getModules(),
          });
        }
      } else if (data.type === 'sign-in') {
        await requestSandpackSecretFromApp(data.teamId);

        window.location.reload();
      } else if (data.type === 'sign-out') {
        removeSandpackSecret();

        window.location.reload();
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
      .fetch(`/api/v1/sandboxes/${id}`, {
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
        const camelized: any = camelizeKeys(res);
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
          customNpmRegistries: x.data.npmRegistries,
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

/**
 * For tracking purpose
 */
document.addEventListener('click', () => {
  dispatch({ type: 'document-focus' });
});
