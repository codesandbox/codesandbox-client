import { join, absolute } from '@codesandbox/common/lib/utils/path';
import { Preset } from 'sandpack-core';
import csbDynamicImportTranspiler from 'sandpack-core/lib/transpiler/transpilers/csb-dynamic-import';

import typescriptTranspiler from '../../transpilers/typescript';
import rawTranspiler from '../../transpilers/raw';
import jsonTranspiler from '../../transpilers/json';
import stylesTranspiler from '../../transpilers/style';
import dojoStylesTranspiler from './transpilers/style';
import babelTranspiler from '../../transpilers/babel';

export default function initialize() {
  const preset = new Preset(
    '@dojo/cli-create-app',
    ['ts', 'tsx', 'js', 'json'],
    {},
    {
      setup: async manager => {
        const stylesPath = absolute(join('src', 'main.css'));

        try {
          const tModule = await manager.resolveTranspiledModuleAsync(
            stylesPath,
            null
          );
          await tModule.transpile(manager);
          tModule.setIsEntry(true);
          tModule.evaluate(manager);
        } catch (e) {
          if (e.type === 'module-not-found') {
            // Do nothing
          } else {
            throw e;
          }
        }
      },
    }
  );

  preset.registerTranspiler(module => /\.tsx?$/.test(module.path), [
    { transpiler: typescriptTranspiler },
    { transpiler: csbDynamicImportTranspiler },
  ]);

  preset.registerTranspiler(module => /\.(c|m)?jsx?$/.test(module.path), [
    {
      transpiler: babelTranspiler,
      options: {
        isV7: true,
        config: {
          parserOpts: {
            plugins: ['objectRestSpread'],
          },
        },
      },
    },
  ]);

  preset.registerTranspiler(module => /\.json$/.test(module.path), [
    { transpiler: jsonTranspiler },
  ]);

  preset.registerTranspiler(module => /\.m\.css$/.test(module.path), [
    { transpiler: dojoStylesTranspiler },
  ]);

  preset.registerTranspiler(module => /\.css$/.test(module.path), [
    { transpiler: stylesTranspiler },
  ]);

  preset.registerTranspiler(() => true, [{ transpiler: rawTranspiler }]);

  return preset;
}
