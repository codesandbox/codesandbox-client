import { FileSystemConfiguration } from '../../../../../../../standalone-packages/codesandbox-browserfs';
import { getTypeFetcher } from './type-downloader';

export const BROWSER_FS_CONFIG: FileSystemConfiguration = {
  fs: 'MountableFileSystem',
  options: {
    '/': { fs: 'InMemory', options: {} },
    '/tmp': { fs: 'InMemory', options: {} },
    '/worker': { fs: 'WorkerFS', options: { worker: self } },
    '/sandbox': {
      fs: 'InMemory',
    },
    '/vscode': {
      fs: 'InMemory',
      options: {},
    },
    // '/extensions': {
    //   fs: 'ZipFS',
    //   options: {
    //     zipData: extensionsBuffer,
    //   },
    // },
    '/extensions': {
      fs: 'HTTPRequest',
      options: {
        index: '/vscode/extensions-bundle/extensions/index.json',
        baseUrl: '/vscode/extensions-bundle/extensions',
      },
    },
    // '/vscode': {
    //   fs: 'AsyncMirror',
    //   options: {
    //     sync: {
    //       fs: 'InMemory',
    //     },
    //     async: {
    //       fs: 'IndexedDB',
    //       options: {
    //         storeName: 'VSCode',
    //       },
    //     },
    //   },
    // },
  },
};

export async function initializeBrowserFS({
  syncSandbox = false,
  syncTypes = false,
} = {}) {
  return new Promise(async resolve => {
    const config = { ...BROWSER_FS_CONFIG };
    let modulesByPath = {};

    if (syncSandbox) {
      if (syncTypes) {
        const { options } = getTypeFetcher();

        config.options['/sandbox/node_modules'] = {
          fs: 'CodeSandboxFS',
          options,
        };
      }

      config.options['/sandbox'] = {
        fs: 'CodeSandboxEditorFS',
        options: {
          api: {
            getState: () => ({
              modulesByPath,
            }),
          },
        },
      };
    }

    BrowserFS.configure(config, async e => {
      if (e) {
        console.error(e);
        return;
      }
      let resolved = false;

      if (syncSandbox) {
        self.addEventListener('message', evt => {
          if (evt.data.$type === 'file-sync') {
            modulesByPath = evt.data.$data;

            if (!resolved) {
              resolve();
              resolved = true;
            }
          }
        });
      } else {
        resolve();
      }

      // BrowserFS is initialized and ready-to-use!
    });
  });
}
