import { writeFile, rename, rmdir, unlink, mkdir } from '../../fs/utils';
import { FileSystemConfiguration } from '../../../../../../../../../standalone-packages/codesandbox-browserfs';
import { getTypeFetcher } from './type-downloader';
import { EXTENSIONS_LOCATION } from '../../constants';

const global = self as any;

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
    '/extensions': {
      fs: 'BundledHTTPRequest',
      options: {
        index: EXTENSIONS_LOCATION + '/extensions/index.json',
        baseUrl: EXTENSIONS_LOCATION + '/extensions',
        logReads: process.env.NODE_ENV === 'development',
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
  extraMounts = {},
} = {}) {
  return new Promise(async resolve => {
    const config = { ...BROWSER_FS_CONFIG };
    let currentSandboxFs = {};

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
            getSandboxFs: () => currentSandboxFs,
          },
        },
      };
    }

    config.options = { ...config.options, ...extraMounts };

    global.BrowserFS.configure(config, async e => {
      if (e) {
        console.error(e);
        return;
      }
      let resolved = false;

      if (syncSandbox) {
        self.addEventListener('message', evt => {
          switch (evt.data.$type) {
            case 'sandbox-fs': {
              currentSandboxFs = evt.data.$data;

              console.log('HEEEEEY', currentSandboxFs);

              if (!resolved) {
                resolve();
                resolved = true;
              }
              break;
            }
            case 'writeFile': {
              const { path, module } = evt.data.$data;
              writeFile(currentSandboxFs, path, module);
              break;
            }
            case 'rename': {
              const { fromPath, toPath } = evt.data.$data;
              rename(currentSandboxFs, fromPath, toPath);
              break;
            }
            case 'rmdir': {
              const { removePath } = evt.data.$data;
              rmdir(currentSandboxFs, removePath);
              break;
            }
            case 'unlink': {
              const { removePath } = evt.data.$data;
              unlink(currentSandboxFs, removePath);
              break;
            }
            case 'mkdir': {
              const { path, directory } = evt.data.$data;
              mkdir(currentSandboxFs, path, directory);
              break;
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
