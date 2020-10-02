import { initializeAll } from 'app/overmind/effects/vscode/extensionHostWorker/common/global';

declare const __DEV__: boolean;

initializeAll().then(() => {
  require('./real-ts-worker');
});
