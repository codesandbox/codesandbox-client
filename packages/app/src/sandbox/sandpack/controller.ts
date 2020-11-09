import registerServiceWorker from '@codesandbox/common/lib/registerServiceWorker';
import { getCurrentManager } from '../compile';
import {
  SandpackRequestPayload,
  createResponseEvent,
  MESSAGE_REQUEST,
  PATH_ASSETS_JSON,
} from './constants';

const ASSET_SANDPACK_SERVICE_WORKER = 'sandpack-service-worker';

const canUseServiceWorker = () => 'serviceWorker' in navigator;

const postServiceWorkerMessage = data => {
  if (!canUseServiceWorker()) {
    return;
  }

  navigator.serviceWorker.ready.then(() => {
    navigator.serviceWorker.controller.postMessage(data);
  });
};

const handleRequest = async ({ requestId, path }: SandpackRequestPayload) => {
  const manager = getCurrentManager();

  if (!manager) {
    postServiceWorkerMessage(createResponseEvent({ requestId, isFile: false }));
    return;
  }

  const isFile = await manager.fileResolver.isFile(path);

  if (!isFile) {
    postServiceWorkerMessage(createResponseEvent({ requestId, isFile: false }));
    return;
  }

  const content = await manager.fileResolver.readFile(path);

  postServiceWorkerMessage(
    createResponseEvent({
      requestId,
      isFile: true,
      content,
      contentType: 'image/png',
    })
  );
};

const startSandpackServiceWorker = () =>
  fetch(PATH_ASSETS_JSON)
    .then(x => x.json())
    .then(assets => assets[ASSET_SANDPACK_SERVICE_WORKER].js)
    .then(swPath => {
      registerServiceWorker(swPath, {} as any);
    });

export const startSandpackController = async () => {
  if (!canUseServiceWorker()) {
    return;
  }

  await startSandpackServiceWorker();

  navigator.serviceWorker.addEventListener('message', event => {
    const { type, payload } = event.data || {};

    if (type === MESSAGE_REQUEST) {
      handleRequest(payload);
    }
  });
};
