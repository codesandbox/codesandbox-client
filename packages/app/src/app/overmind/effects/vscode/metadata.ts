const VSCODE_METADATA = {
  CORE: {
    paths: {
      src: process.env.VSCODE ? '/vscode/out/vs' : '/public/vscode33/vs',
      'npm/dev': 'node_modules/monaco-editor-core/dev/vs',
      'npm/min': 'node_modules/monaco-editor-core/min/vs',
      built: '/vscode/out-monaco-editor-core/min/vs',
      releaseDev: 'release/dev/vs',
      releaseMin: 'release/min/vs',
    },
  },
  PLUGINS: [],
};

const MONACO_METADATA = {
  CORE: {
    paths: {
      src: '/public/14/vs',
      'npm/dev': 'node_modules/monaco-editor-core/dev/vs',
      'npm/min': 'node_modules/monaco-editor-core/min/vs',
      built: '/vscode/out-monaco-editor-core/min/vs',
      releaseDev: 'release/dev/vs',
      releaseMin: 'release/min/vs',
    },
  },
  PLUGINS: [
    {
      name: 'monaco-typescript',
      contrib: 'vs/language/typescript/monaco.contribution',
      modulePrefix: 'vs/language/typescript',
      thirdPartyNotices: 'node_modules/monaco-typescript/ThirdPartyNotices.txt',
      paths: {
        src: '/public/14/vs/language/typescript',
        'npm/dev': '../monaco-typescript/release/dev',
        'npm/min': '/public/14/vs/language/typescript',
        esm: '../monaco-typescript/release/esm',
      },
    },
    {
      name: 'monaco-css',
      contrib: 'vs/language/css/monaco.contribution',
      modulePrefix: 'vs/language/css',
      paths: {
        src: '/public/14/vs/language/css',
        'npm/dev': '../monaco-css/release/dev',
        'npm/min': '/public/14/vs/language/css',
        esm: 'node_modules/monaco-css/release/esm',
      },
    },
    {
      name: 'monaco-json',
      contrib: 'vs/language/json/monaco.contribution',
      modulePrefix: 'vs/language/json',
      paths: {
        src: '/public/14/vs/language/json',
        'npm/dev': 'node_modules/monaco-json/release/dev',
        'npm/min': '/public/14/vs/language/json',
        esm: 'node_modules/monaco-json/release/esm',
      },
    },
    {
      name: 'monaco-html',
      contrib: 'vs/language/html/monaco.contribution',
      modulePrefix: 'vs/language/html',
      thirdPartyNotices: 'node_modules/monaco-html/ThirdPartyNotices.txt',
      paths: {
        src: '/public/14/vs/language/html',
        'npm/dev': 'node_modules/monaco-html/release/dev',
        'npm/min': '/public/14/vs/language/html',
        esm: 'node_modules/monaco-html/release/esm',
      },
    },
    {
      name: 'monaco-languages',
      contrib: 'vs/basic-languages/monaco.contribution',
      modulePrefix: 'vs/basic-languages',
      thirdPartyNotices: 'node_modules/monaco-languages/ThirdPartyNotices.txt',
      paths: {
        src: '/public/14/vs/basic-languages',
        'npm/dev': '../monaco-languages/release/dev',
        'npm/min': '/public/14/vs/basic-languages',
        esm: 'node_modules/monaco-languages/release/esm',
      },
    },
  ],
};

if (typeof exports !== 'undefined') {
  exports.VSCODE_METADATA = VSCODE_METADATA;
  exports.MONACO_METADATA = MONACO_METADATA;
} else {
  // @ts-ignore
  self.VSCODE_METADATA = VSCODE_METADATA;
  // @ts-ignore
  self.MONACO_METADATA = MONACO_METADATA;
}
