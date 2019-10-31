import { commonPostMessage } from '@codesandbox/common/lib/utils/global';

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

      if (syncSandbox) {
        self.addEventListener('message', evt => {
          switch (evt.data.$type) {
            case 'sandbox-fs': {
              currentSandboxFs = evt.data.$data;
              break;
            }
            case 'writeFile': {
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
          $data: {},
        });
      }

      resolve();

      // BrowserFS is initialized and ready-to-use!
    });
  });
}
