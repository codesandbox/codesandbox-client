/* eslint-disable no-console */
const fs = require('fs-extra');
const path = require('path');
const { staticAssets } = require('../config/build');

const assets = [
  ...staticAssets,
  {
    from: 'packages/app/www',
    to: '',
  },
  {
    from: 'packages/homepage/public',
    to: '',
  },
  {
    from: 'standalone-packages/monaco-editor/release/min/vs',
    to: 'public/14/vs',
  },
  {
    from: 'standalone-packages/codesandbox-browserfs/dist',
    to: 'static/browserfs2',
  },
  {
    from: 'standalone-packages/vscode-editor/release/min/vs',
    to: 'public/vscode8',
  },
  {
    from: 'packages/app/public',
    to: '',
  },
];

const rootPath = path.resolve(__dirname, '../../..');
const buildPath = path.resolve(rootPath, 'www');

console.log('Copying assets...');

assets.forEach(({ from, to }) => {
  const srcPath = path.resolve(rootPath, from);
  const dstPath = path.resolve(buildPath, to);
  console.log(`${srcPath} => ${dstPath}`);
  fs.copySync(srcPath, dstPath);
});
