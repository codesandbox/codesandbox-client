/* eslint-disable no-console */
const fs = require('fs-extra');
const path = require('path');
const rimrafSync = require('rimraf').sync;
const { staticAssets } = require('../config/build');

const { SANDBOX_ONLY } = process.env;

const assets = [
  ...staticAssets,
  {
    from: 'packages/app/www',
    to: '',
  },
  !SANDBOX_ONLY && {
    from: 'standalone-packages/monaco-editor/release/min/vs',
    to: 'public/14/vs',
  },
  !SANDBOX_ONLY && {
    from: 'standalone-packages/vscode-editor/release/min/vs',
    to: 'public/vscode33/vs',
  },
  {
    from: 'packages/app/public',
    to: '',
  },
  {
    from: '.env',
    to: '.env',
  },
  {
    from: 'env.sh',
    to: 'env.sh',
  },
].filter(Boolean);

const rootPath = path.resolve(__dirname, '../../..');
const buildPath = path.resolve(rootPath, 'www');

rimrafSync(buildPath);

console.log('Copying assets...');

assets.forEach(({ from, to }) => {
  const srcPath = path.resolve(rootPath, from);
  const dstPath = path.resolve(buildPath, to);
  console.log(`${srcPath} => ${dstPath}`);

  // We need to deference symlinks to prevent recursion
  fs.copySync(srcPath, dstPath, { dereference: true });
});
