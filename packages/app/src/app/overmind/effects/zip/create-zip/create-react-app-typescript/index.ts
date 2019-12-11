import { Sandbox, Module, Directory } from '@codesandbox/common/lib/types';
// @ts-ignore
import files from 'buffer-loader!./files.zip'; // eslint-disable-line import/no-webpack-loader-syntax
import { createFile, createDirectoryWithFiles } from '..';

/**
 * Add necessary scripts to package.json if they don't exist
 * @param {*} module
 */
function alterPackageJSON(module: Module) {
  try {
    const parsed = JSON.parse(module.code);

    if (!parsed.scripts || !parsed.scripts.start) {
      parsed.scripts = parsed.scripts || {};

      parsed.scripts.start = parsed.scripts.start || 'react-scripts-ts start';
      parsed.scripts.build = parsed.scripts.build || 'react-scripts-ts build';
      parsed.scripts.test =
        parsed.scripts.test || 'react-scripts-ts test --env=jsdom';
      parsed.scripts.eject = parsed.scripts.eject || 'react-scripts-ts eject';
    }

    if (
      !parsed.dependencies ||
      !parsed.dependencies['react-scripts-ts'] ||
      !parsed.devDependencies ||
      !parsed.devDependencies['react-scripts-ts']
    ) {
      parsed.dependencies['react-scripts-ts'] = '^2.13.0';
    }

    return { ...module, code: JSON.stringify(parsed, null, 2) };
  } catch (e) {
    return module;
  }
}

export default function createZip(
  zip,
  sandbox: Sandbox,
  modules: Array<Module>,
  directories: Array<Directory>
) {
  return zip.loadAsync(files).then(async src => {
    await Promise.all(
      modules
        .filter(x => x.directoryShortid == null)
        .map(x => {
          if (x.title === 'package.json' && x.directoryShortid == null) {
            return createFile(alterPackageJSON(x), src);
          }

          return createFile(x, src);
        })
    );

    await Promise.all(
      directories
        .filter(x => x.directoryShortid == null)
        .map(x => createDirectoryWithFiles(modules, directories, x, src))
    );
  });
}
