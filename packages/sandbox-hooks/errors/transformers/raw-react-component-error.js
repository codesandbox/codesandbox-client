import { actions, dispatch } from 'codesandbox-api';

import { basename } from '@codesandbox/common/lib/utils/path';

function findRawModule(module) {
  const rawModule = Array.from(module.dependencies).find(
    m => !/\.([\w]{2}|[\w]{3})$/.test(m.module.path)
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
export default function (error: Error, module) {
  if (
    error.message.includes(
      "Failed to execute 'createElement' on 'Document': The tag name provided "
    )
  ) {
    const result = findRawModule(module);

    if (result) {
      const [sourceModule, rawModule] = result;
      return {
        name: 'Raw import',
        message: `It seems like '${basename(
          sourceModule.module.path
        )}' is importing a raw module (${basename(rawModule.module.path)})`,
        suggestions: [
          {
            title: `Rename ${basename(rawModule.module.path)} to ${basename(
              rawModule.module.path
            )}.js`,
            action: () => {
              dispatch(
                actions.source.modules.rename(
                  rawModule.module.path,
                  `${basename(rawModule.module.path)}.js`
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
