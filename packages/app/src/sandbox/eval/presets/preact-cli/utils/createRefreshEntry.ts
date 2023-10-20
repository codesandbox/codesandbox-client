import { Manager } from 'sandpack-core';

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
