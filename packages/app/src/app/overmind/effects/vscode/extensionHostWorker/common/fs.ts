import {
  commonPostMessage,
  getGlobal,
} from '@codesandbox/common/lib/utils/global';

import { FileSystemConfiguration } from '../../../../../../../../../standalone-packages/codesandbox-browserfs';
import { EXTENSIONS_LOCATION } from '../../constants';
import {
  mkdir,
  rename,
  rmdir,
  unlink,
  writeFile,
} from '../../sandboxFsSync/utils';
import { getTypeFetcher } from './type-downloader';

const global = getGlobal();

export const BROWSER_FS_CONFIG: FileSystemConfiguration = {
  fs: 'MountableFileSystem',
  options: {
    '/': { fs: 'InMemory', options: {} },
    '/tmp': { fs: 'InMemory', options: {} },
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
  let isInitialSync = true;
  return new Promise(resolve => {
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

    global.BrowserFS.configure(config, e => {
      if (e) {
        console.error(e);
        return;
      }

      if (syncSandbox) {
        self.addEventListener('message', evt => {
          switch (evt.data.$type) {
            case 'typings-sync': {
              if (isInitialSync) {
                commonPostMessage({
                  $broadcast: true,
                  $type: 'sync-sandbox',
                  $data: {},
                });
              }
              break;
            }
            case 'sandbox-fs': {
              currentSandboxFs = evt.data.$data;
              if (isInitialSync) {
                isInitialSync = false;
                global.BrowserFS.BFSRequire(
                  'fs'
                ).rename(
                  '/sandbox/node_modules/@types',
                  '/sandbox/node_modules/@types',
                  () => {}
                );
                resolve();
              }
              break;
            }
            case 'write-file': {
              const module = evt.data.$data;
              writeFile(currentSandboxFs, module);
              break;
            }
            case 'rename': {
              const { fromPath, toPath } = evt.data.$data;
              rename(currentSandboxFs, fromPath, toPath);
              break;
            }
            case 'rmdir': {
              const directory = evt.data.$data;
              rmdir(currentSandboxFs, directory);
              break;
            }
            case 'unlink': {
              const module = evt.data.$data;
              unlink(currentSandboxFs, module);
              break;
            }
            case 'mkdir': {
              const directory = evt.data.$data;
              mkdir(currentSandboxFs, directory);
              break;
            }
          }
        });

        if (syncTypes) {
          commonPostMessage({
            $broadcast: true,
            $type: 'sync-types',
            $data: {},
          });
        } else {
          commonPostMessage({
            $broadcast: true,
            $type: 'sync-sandbox',
            $data: {},
          });
        }
      } else {
        resolve();
      }

      // BrowserFS is initialized and ready-to-use!
    });
  });
}
