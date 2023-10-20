import { Manager } from 'sandpack-core';

/**
 * When using React Refresh we need to evaluate some code before 'react-dom' is initialized
 * (https://github.com/facebook/react/issues/16604#issuecomment-528663101) this is the code.
 */
export async function createRefreshEntry(manager: Manager) {
  const entryModule = {
    path: '/node_modules/__csb/prefresh-entrypoint.js',
    code: `if (typeof window !== 'undefined') {
require('@prefresh/core');
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
