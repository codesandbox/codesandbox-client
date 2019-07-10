import {
  initializeGlobals,
  initializePolyfills,
  loadBrowserFS,
} from '../common/global';
import { initializeBrowserFS } from '../common/fs';

initializePolyfills();
loadBrowserFS();
initializeGlobals();

async function initialize() {
  await initializeBrowserFS({ syncSandbox: true, syncTypes: true });
}

initialize();
