import {
  commonPostMessage,
  getGlobal,
} from '@codesandbox/common/lib/utils/global';

import {
  IManager,
  IModule,
} from '../../../../../../../../../standalone-packages/codesandbox-browserfs/dist/node/backend/CodeSandboxFS';

const ctx = getGlobal();

export function getTypeFetcher() {
  let types: {
    [path: string]: {
      module: IModule;
    };
  } = {};

  const options: {
    manager: IManager;
  } = {
    manager: {
      getTranspiledModules: () => types,

      addModule(module: IModule) {},
      removeModule(module: IModule) {},
      moveModule(module: IModule, newPath) {},
      updateModule(module: IModule) {},
    },
  };

  self.addEventListener('message', evt => {
    if (evt.data.$type === 'typings-sync') {
      types = evt.data.$data;

      // This forces the file watchers to emit, which causes typescript to reload
      ctx.BrowserFS.BFSRequire('fs').rename(
        '/sandbox/node_modules/@types',
        '/sandbox/node_modules/@types',
        () => {}
      );
    }
  });

  commonPostMessage({
    $broadcast: true,
    $type: 'sync-types',
    $data: {},
  });

  return { options };
}
