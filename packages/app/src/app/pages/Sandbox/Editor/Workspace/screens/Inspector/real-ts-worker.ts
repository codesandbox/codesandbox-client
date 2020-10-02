import ts from 'typescript';

import _debug from '@codesandbox/common/lib/utils/debug';
import { commonPostMessage } from '@codesandbox/common/lib/utils/global';
import { initializeBrowserFS } from 'app/overmind/effects/vscode/extensionHostWorker/common/fs';

const debug = _debug('cs:cp-worker');

declare const __DEV__: boolean;

const fs = require('fs');
const noop = () => {};

self.addEventListener('message', async e => {
  const { data } = e;

  if (data.$type === 'worker-manager') {
    if (data.$event === 'init') {
      debug('Initializing BrowserFS');
      await initializeBrowserFS({
        syncSandbox: true,
        syncTypes: true,
      });
      debug('Initialized BrowserFS', data.data.env);

      console.log('GGETTING HOST');

      const tsSystem: ts.System = {
        args: [],
        newLine: '\n',
        useCaseSensitiveFileNames: true,
        write: noop,
        readFile: path => fs.readFileSync(path).toString(),
        writeFile: (p, data) => fs.writeFileSync(p, data),
        fileExists: fs.existsSync,
        resolvePath: p => require.resolve(p),
        directoryExists: p => {
          try {
            fs.statSync(p);
            return true;
          } catch (e) {
            return false;
          }
        },
        createDirectory: noop,
        getExecutingFilePath: () => '/sandbox/index.tsx',
        getCurrentDirectory: () => '/sandbox',
        getDirectories: fs.readdirSync,
        readDirectory: fs.readdirSync,
        exit: noop,
      };
      const tsHost = ts.createIncrementalCompilerHost({}, tsSystem);

      const program = ts.createIncrementalProgram({
        rootNames: ['src/index.tsx'],
        options: {},
        host: tsHost,
      });

      console.log(program);
    }
  }
});

commonPostMessage({ $type: 'ready' });
