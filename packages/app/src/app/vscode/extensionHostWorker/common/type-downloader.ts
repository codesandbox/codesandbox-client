import {
  IModule,
  IManager,
} from '../../../../../../../standalone-packages/codesandbox-browserfs/dist/node/backend/CodeSandboxFS';

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
      BrowserFS.BFSRequire('fs').rename(
        '/sandbox/node_modules/@types',
        '/sandbox/node_modules/@types',
        () => {}
      );
    }
  });

  // @ts-ignore
  self.postMessage({
    $broadcast: true,
    $type: 'request-data',
    $data: {},
  });

  return { options };
}
