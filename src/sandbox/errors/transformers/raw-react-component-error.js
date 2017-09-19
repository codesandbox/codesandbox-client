import { actions, dispatch } from 'codesandbox-api';

function findRawModule(module) {
  const rawModule = Array.from(module.dependencies).find(
    m => !/\.([\w]{2}|[\w]{3})$/.test(m.module.title)
  );

  if (rawModule) {
    return [module, rawModule];
  }

  // The error is thrown at the root, so we check for children components
  return Array.from(module.dependencies).reduce((foundResult, m) => {
    // We already found it, immediately return
    if (foundResult) return foundResult;

    return findRawModule(m);
  }, null);
}

/**
 * This transformer detects raw imports used as React component, when the module
 * is missing a file extension
 *
 * @export
 * @param {Error} error
 * @param {any} module
 * @returns
 */
export default function(error: Error, module) {
  if (error.message.includes('Invalid tag: import React')) {
    const result = findRawModule(module);

    if (result) {
      const [sourceModule, rawModule] = result;
      return {
        name: 'Raw import',
        message: `It seems like '${sourceModule.module
          .title}' is importing a raw module (${rawModule.module.title})`,
        suggestions: [
          {
            title: `Rename ${rawModule.module.title} to ${rawModule.module
              .title}.js`,
            action: () => {
              dispatch(
                actions.source.modules.rename(
                  rawModule.module.id,
                  `${rawModule.module.title}.js`
                )
              );
            },
          },
        ],
      };
    }
  }

  return null;
}
