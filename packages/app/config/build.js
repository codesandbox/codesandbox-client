const isDev = process.env.NODE_ENV === 'development';
const { SANDBOX_ONLY } = process.env;
const staticAssets = [
  !SANDBOX_ONLY && {
    from: 'standalone-packages/vscode-editor/release/min/vs',
    to: 'public/vscode33/vs',
  },
  !SANDBOX_ONLY && {
    from: 'standalone-packages/vscode-extensions/out',
    to: 'public/vscode-extensions/v21',
  },
  !SANDBOX_ONLY && {
    from: 'node_modules/vscode-oniguruma/release/onig.wasm',
    to: 'public/vscode-oniguruma/1.3.1/onig.wasm',
  },
  !SANDBOX_ONLY && {
    from: 'node_modules/onigasm/lib/onigasm.wasm',
    to: 'public/onigasm/2.2.1/onigasm.wasm',
  },
  !SANDBOX_ONLY && {
    from:
      'standalone-packages/vscode-textmate/node_modules/onigasm/lib/onigasm.wasm',
    to: 'public/onigasm/2.1.0/onigasm.wasm',
  },
  !SANDBOX_ONLY && {
    from: 'node_modules/monaco-vue/release/min',
    to: 'public/14/vs/language/vue',
  },
  !SANDBOX_ONLY && {
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
    to: 'static/browserfs12',
  },
  // For caching purposes
  {
    from: isDev
      ? 'standalone-packages/codesandbox-browserfs/build'
      : 'standalone-packages/codesandbox-browserfs/dist',
    to: 'static/browserfs11',
  },
  // For caching purposes
  !SANDBOX_ONLY && {
    from: isDev
      ? 'standalone-packages/codesandbox-browserfs/build'
      : 'standalone-packages/codesandbox-browserfs/dist',
    to: 'static/browserfs10',
  },
  // For caching purposes
  !SANDBOX_ONLY && {
    from: isDev
      ? 'standalone-packages/codesandbox-browserfs/build'
      : 'standalone-packages/codesandbox-browserfs/dist',
    to: 'static/browserfs9',
  },
  !SANDBOX_ONLY && {
    from: isDev
      ? 'standalone-packages/codesandbox-browserfs/build'
      : 'standalone-packages/codesandbox-browserfs/dist',
    to: 'static/browserfs8',
  },
].filter(Boolean);

module.exports = {
  staticAssets,
};
