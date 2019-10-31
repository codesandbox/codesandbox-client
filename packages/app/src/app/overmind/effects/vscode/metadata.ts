const VSCODE_METADATA = {
  CORE: {
    paths: {
      src: process.env.VSCODE ? '/vscode/out/vs' : '/public/vscode24/vs',
      'npm/dev': 'node_modules/monaco-editor-core/dev/vs',
      'npm/min': 'node_modules/monaco-editor-core/min/vs',
      built: '/vscode/out-monaco-editor-core/min/vs',
      releaseDev: 'release/dev/vs',
      releaseMin: 'release/min/vs',
    },
  },
  PLUGINS: [],
};

if (typeof exports !== 'undefined') {
  exports.VSCODE_METADATA = VSCODE_METADATA;
} else {
  // @ts-ignore
  self.VSCODE_METADATA = VSCODE_METADATA;
}
