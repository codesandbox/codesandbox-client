import {
  commonPostMessage,
  getGlobal,
} from '@codesandbox/common/lib/utils/global';
import * as uuid from 'uuid';

import { FileSystemConfiguration } from '../../../../../../../../../standalone-packages/codesandbox-browserfs';
import { IModule } from '../../../../../../../../../standalone-packages/codesandbox-browserfs/dist/node/backend/CodeSandboxFS';
import { EXTENSIONS_LOCATION } from '../../constants';
import {
  appendFile,
  mkdir,
  rename,
  rmdir,
  unlink,
  writeFile,
} from '../../SandboxFsSync/utils';

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
  let types: {
    [path: string]: {
      module: IModule;
    };
  } = {};

  return new Promise<void>(resolve => {
    const config = { ...BROWSER_FS_CONFIG };
    let currentSandboxFs = {};

    let fsId = uuid.v4();

    if (syncSandbox) {
      if (syncTypes) {
        config.options['/sandbox/node_modules'] = {
          fs: 'CodeSandboxFS',
          options: {
            manager: {
              getTranspiledModules: () => types,
              addModule(module: IModule) {},
              removeModule(module: IModule) {},
              moveModule(module: IModule, newPath) {},
              updateModule(module: IModule) {},
            },
          },
        };

        config.options['/extensions/node_modules/typescript'] = {
          fs: 'JSDelivrRequest',
          options: {
            dependency: 'typescript',
            version: '4.9.3',
          },
        };
      }

      config.options['/sandbox'] = {
        fs: 'CodeSandboxEditorFS',
        options: {
          api: {
            getSandboxFs: () => currentSandboxFs,
            getJwt: () => '',
          },
        },
      };
    }

    config.options = { ...config.options, ...extraMounts };

    function touchFileSystem() {
      // This forces the file watchers to emit, which causes typescript to reload
      global.BrowserFS.BFSRequire('fs').rename(
        '/sandbox/node_modules',
        '/sandbox/node_modules',
        () => {}
      );
    }

    global.BrowserFS.configure(config, e => {
      if (e) {
        console.error(e);
        return;
      }

      if (syncSandbox) {
        // Resolve after 3s, if it doesn't resolve, vscode won't be able to resolve the ext host
        // and it won't try to reconnect.
        const timeout = setTimeout(() => {
          resolve();
        }, 3000);

        const callResolve = () => {
          clearTimeout(timeout);
          resolve();
        };

        self.addEventListener('message', evt => {
          // Some messages are specific to this worker
          if (!evt.data.$fs_ids || !evt.data.$fs_ids.includes(fsId)) {
            return;
          }

          switch (evt.data.$type) {
            case 'reset': {
              isInitialSync = true;
              fsId = uuid.v4();
              types = {};
              currentSandboxFs = {};
              commonPostMessage({
                $broadcast: true,
                $type: 'sync-sandbox',
                $fs_id: fsId,
                $data: {},
              });
              break;
            }
            case 'types-sync': {
              types = evt.data.$data;
              touchFileSystem();
              if (isInitialSync) {
                isInitialSync = false;
                callResolve();
              }
              break;
            }
            case 'package-types-sync': {
              Object.assign(types, evt.data.$data);
              touchFileSystem();
              break;
            }
            case 'types-remove': {
              const deps = evt.data.$data;

              Object.keys(deps).forEach(depKey => {
                delete types[depKey];
              });
              touchFileSystem();
              break;
            }
            case 'sandbox-fs': {
              currentSandboxFs = evt.data.$data;
              if (isInitialSync) {
                commonPostMessage({
                  $broadcast: true,
                  $type: 'sync-types',
                  $fs_id: fsId,
                  $data: {},
                });
              } else {
                callResolve();
              }
              break;
            }
            case 'append-file': {
              const module = evt.data.$data;
              appendFile(currentSandboxFs, module);
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

        commonPostMessage({
          $broadcast: true,
          $type: 'sync-sandbox',
          $fs_id: fsId,
          $data: {},
        });
      } else {
        resolve();
      }
    });
  });
}
