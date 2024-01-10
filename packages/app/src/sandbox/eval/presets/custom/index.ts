import { Preset, Manager } from 'sandpack-core';
import rawTranspiler from '../../transpilers/raw';
import babelTranspiler from '../../transpilers/babel';
import jsonTranspiler from '../../transpilers/json';

const transpilerMap = {
  'codesandbox:raw': rawTranspiler,
  'codesandbox:json': jsonTranspiler,
  'codesandbox:babel': babelTranspiler,
};

async function registerTranspilers(
  manager: Manager,
  preset: Preset,
  transpilerConfig: { [expression: string]: string[] }
) {
  const savedTranspilers = {};
  const configModule = await manager.resolveTranspiledModule(
    '/.codesandbox/template.json',
    '/',
    []
  );
  configModule.setIsEntry(true);

  const initializers = await Promise.all(
    Object.keys(transpilerConfig).map(async expression => {
      const transpilers = transpilerConfig[expression];

      const evaluatedTranspilers = await Promise.all(
        transpilers.map(async t => {
          if (savedTranspilers[t]) {
            return savedTranspilers[t];
          }

          if (t.startsWith('codesandbox:')) {
            const transpiler = transpilerMap[t];

            if (!transpiler) {
              throw new Error(
                `Could not register custom transpiler: ${t} is unknown to Sandpack.`
              );
            }

            return { transpiler };
          }

          const tModule = await manager.resolveTranspiledModule(
            t,
            '/.codesandbox/template.json',
            []
          );

          if (tModule.shouldTranspile()) {
            tModule.initiators.add(configModule);
            configModule.dependencies.add(tModule);

            await tModule.transpile(manager);
          }

          const transpiler = tModule.compilation
            ? tModule.compilation.exports
            : tModule.evaluate(manager);

          savedTranspilers[t] = transpiler;

          return {
            transpiler,
          };
        })
      );

      return () => {
        const regex = new RegExp(expression);
        preset.registerTranspiler(
          module => regex.test(module.path),
          evaluatedTranspilers
        );
      };
    })
  );

  preset.resetTranspilers();

  initializers.forEach(x => x());
}

export default function initialize() {
  let initialized = false;
  const customPreset = new Preset('custom', undefined, undefined, {
    setup: async (manager: Manager) => {
      // if (updatedModules.some(m => m.module.path.startsWith('/.codesandbox'))) {
      //   initialized = false;
      //   manager.clearCompiledCache();
      //   manager.clearCache();
      // }

      if (!initialized) {
        // eslint-disable-next-line no-console
        console.log('Initializing custom template');
        customPreset.resetTranspilers();
        // Our JS/JSON transpiler to transpile the transpilers
        customPreset.registerTranspiler(m => /\.jsx?$/.test(m.path), [
          { transpiler: babelTranspiler },
        ]);

        customPreset.registerTranspiler(m => /\.json$/.test(m.path), [
          { transpiler: jsonTranspiler },
        ]);

        const customConfig =
          manager.configurations.customTemplate &&
          manager.configurations.customTemplate.parsed;
        if (!customConfig) {
          throw new Error('No configuration specified for the custom template');
        }

        const { sandpack } = customConfig;

        if (sandpack) {
          customPreset.defaultAliases = sandpack.defaultAliases || [];

          if (sandpack.transpilers) {
            await registerTranspilers(
              manager,
              customPreset,
              sandpack.transpilers
            );
          }
        }

        customPreset.registerTranspiler(() => true, [
          { transpiler: rawTranspiler },
        ]);
        initialized = true;
      }
    },
  });

  return customPreset;
}
