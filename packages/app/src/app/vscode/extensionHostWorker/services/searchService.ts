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

  self.addEventListener('message', e => {
    if (e.data.$type === 'input-write') {
      const { $type, $data } = e.data.$data;
      if ($type === 'file-search') {
        const { query } = $data;
      }
    }
  });
}

initialize();
