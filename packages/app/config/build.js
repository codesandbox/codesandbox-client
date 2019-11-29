const isDev = process.env.NODE_ENV === 'development';
const staticAssets = [
  {
    from: 'standalone-packages/vscode-editor/release/min/vs',
    to: 'public/vscode25/vs',
  },
  {
    from: 'standalone-packages/vscode-extensions/out',
    to: 'public/vscode-extensions/v10',
  },
  {
    from: 'node_modules/onigasm/lib/onigasm.wasm',
    to: 'public/onigasm/2.2.1/onigasm.wasm',
  },
  {
    from:
      'standalone-packages/vscode-textmate/node_modules/onigasm/lib/onigasm.wasm',
    to: 'public/onigasm/2.1.0/onigasm.wasm',
  },
  {
    from: 'node_modules/monaco-vue/release/min',
    to: 'public/14/vs/language/vue',
  },
  {
    from: 'standalone-packages/monaco-editor/release/min/vs',
    to: 'public/14/vs',
  },
  {
    from: 'packages/app/static',
    to: 'static',
  },
  {
    from: isDev
      ? 'standalone-packages/codesandbox-browserfs/build'
      : 'standalone-packages/codesandbox-browserfs/dist',
    to: 'static/browserfs7',
  },
  // For caching purposes
  {
    from: isDev
      ? 'standalone-packages/codesandbox-browserfs/build'
      : 'standalone-packages/codesandbox-browserfs/dist',
    to: 'static/browserfs6',
  },
  // For caching purposes
  {
    from: isDev
      ? 'standalone-packages/codesandbox-browserfs/build'
      : 'standalone-packages/codesandbox-browserfs/dist',
    to: 'static/browserfs5',
  },
  // For caching purposes
  {
    from: isDev
      ? 'standalone-packages/codesandbox-browserfs/build'
      : 'standalone-packages/codesandbox-browserfs/dist',
    to: 'static/browserfs4',
  },
  // For Monaco
  {
    from: isDev
      ? 'standalone-packages/codesandbox-browserfs/build'
      : 'standalone-packages/codesandbox-browserfs/dist',
    to: 'static/browserfs3',
  },
];

module.exports = {
  staticAssets,
};
