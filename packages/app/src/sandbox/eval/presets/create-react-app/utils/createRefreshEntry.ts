import { Manager } from 'sandpack-core';

/**
 * When using React Refresh we need to evaluate some code before 'react-dom' is initialized
 * (https://github.com/facebook/react/issues/16604#issuecomment-528663101) this is the code.
 */
export async function createRefreshEntry(manager: Manager) {
  const entryModule = {
    path: '/node_modules/__csb/react-dom-entrypoint.js',
    code: `if (typeof window !== 'undefined') {
const runtime = require('react-refresh/runtime');
runtime.injectIntoGlobalHook(window);
window.$RefreshReg$ = () => {};
window.$RefreshSig$ = () => type => type;
}
`,
  };
  manager.addModule(entryModule);

  const tEntryModule = manager.getTranspiledModule(entryModule);
  tEntryModule.setIsEntry(true);

  await tEntryModule
    .transpile(manager)
    .then(() => tEntryModule.evaluate(manager, { force: true }));
}
