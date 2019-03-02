import type { Sandbox, Module, Directory } from 'common/types';
import files from 'buffer-loader!./files.zip'; // eslint-disable-line import/no-webpack-loader-syntax
import { createFile, createPackageJSON, createDirectoryWithFiles } from '../';

export default function createZip(
  zip,
  sandbox: Sandbox,
  modules: Array<Module>,
  directories: Array<Directory>
) {
  return zip.loadAsync(files).then(async srcFolder => {
    const src = srcFolder.folder('src');

    await Promise.all(
      modules
        .filter(x => x.directoryShortid == null)
        .filter(x => x.title !== 'index.html') // This will be included in the body
        .map(x => createFile(x, src))
    );

    await Promise.all(
      directories
        .filter(x => x.directoryShortid == null)
        .map(x => createDirectoryWithFiles(modules, directories, x, src))
    );

    zip.file(
      'package.json',
      createPackageJSON(
        sandbox,
        {},
        {
          rollup: '^0.47.6',
          'rollup-plugin-buble': '^0.15.0',
          'rollup-plugin-commonjs': '^8.1.0',
          'rollup-plugin-node-resolve': '^3.0.0',
          'rollup-plugin-svelte': '^3.1.0',
          'rollup-plugin-uglify': '^2.0.1',
          'rollup-watch': '^4.3.1',
          serve: '^6.0.6',
        },
        {
          build: 'rollup -c',
          dev: 'serve public & rollup -c -w',
          start: 'serve public',
        }
      )
    );
  });
}
