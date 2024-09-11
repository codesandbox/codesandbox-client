// @flow
import { join, absolute } from '@codesandbox/common/lib/utils/path';
import { Manager, TranspiledModule, Preset } from 'sandpack-core';
import csbDynamicImportTranspiler from 'sandpack-core/lib/transpiler/transpilers/csb-dynamic-import';

import angular2Transpiler from '../../transpilers/angular2-template';
import typescriptTranspiler from '../../transpilers/typescript';
import babelTranspiler from '../../transpilers/babel';
import jsonTranspiler from '../../transpilers/json';
import stylesTranspiler from '../../transpilers/style';
import sassTranspiler from '../../transpilers/sass';
import rawTranspiler from '../../transpilers/raw';
import stylusTranspiler from '../../transpilers/stylus';
import lessTranspiler from '../../transpilers/less';
import postcssTranspiler from '../../transpilers/postcss';

let polyfillsLoaded = false;

async function addAngularJSONPolyfills(manager) {
  const { parsed } = manager.configurations['angular-config'];

  const { defaultProject } = parsed;

  if (!defaultProject || !parsed.projects) {
    return;
  }

  const project = parsed.projects[defaultProject];

  if (project && project.architect) {
    const { build } = project.architect;
    if (build.options) {
      if (project.root && build.options.polyfill) {
        const polyfillLocation = absolute(
          join(project.root, build.options.polyfill)
        );
        const polyfills = await manager.resolveModuleAsync({
          path: polyfillLocation,
        });

        await manager.transpileModules(polyfills);
        manager.evaluateModule(polyfills);
      }
    }
  }
}

async function addAngularCLIPolyfills(manager) {
  const { parsed } = manager.configurations['angular-cli'];
  if (parsed.apps && parsed.apps[0]) {
    const app = parsed.apps[0];

    if (app.root && app.polyfills) {
      const polyfillLocation = absolute(join(app.root, app.polyfills));
      const polyfills = await manager.resolveModuleAsync({
        path: polyfillLocation,
      });

      await manager.transpileModules(polyfills);
      manager.evaluateModule(polyfills);
    }
  }
}

async function addAngularJSONResources(manager) {
  const { parsed } = manager.configurations['angular-config'];

  const { defaultProject } = parsed;
  if (!defaultProject || !parsed.projects) {
    return;
  }

  const project = parsed.projects[defaultProject];

  if (project && project.architect) {
    const { build } = project.architect;
    if (build.options) {
      const { styles = [], scripts = [] } = build.options;

      /* eslint-disable no-await-in-loop */
      for (let i = 0; i < styles.length; i++) {
        const p = styles[i];

        const finalPath = absolute(join(project.root, p.input || p));

        const tModule = await manager.resolveTranspiledModuleAsync(
          finalPath,
          null
        );

        await tModule.transpile(manager);
        tModule.setIsEntry(true);
        tModule.evaluate(manager);
      }

      const scriptTModules: TranspiledModule[] = await Promise.all(
        scripts.map(async p => {
          const finalPath = absolute(join(project.root, p));
          const tModule = await manager.resolveTranspiledModuleAsync(
            finalPath,
            null
          );
          tModule.setIsEntry(true);
          return tModule.transpile(manager);
        })
      );

      scriptTModules.forEach(t => {
        t.evaluate(manager, { asUMD: true });
      });
    }
  }
}

const getPathFromResource = (root, p) => {
  const nodeModuleRegex = /(^\.\/)?node_modules\//;
  if (/(^\.\/)?node_modules/.test(p)) {
    // If starts with node_modules or ./node_modules
    return p.replace(nodeModuleRegex, '');
  }

  return absolute(join(root || 'src', p));
};

async function addAngularCLIResources(manager: Manager) {
  const { parsed } = manager.configurations['angular-cli'];
  if (parsed.apps && parsed.apps[0]) {
    const app = parsed.apps[0];

    const { styles = [], scripts = [] } = app;

    /* eslint-disable no-await-in-loop */
    for (let i = 0; i < styles.length; i++) {
      const p = styles[i];
      const finalPath = getPathFromResource(app.root, p.input || p);

      const tModule = await manager.resolveTranspiledModuleAsync(
        finalPath,
        null
      );

      await tModule.transpile(manager);
      tModule.setIsEntry(true);
      tModule.evaluate(manager);
    }
    /* eslint-enable no-await-in-loop */

    const scriptTModules: TranspiledModule[] = await Promise.all(
      scripts.map(async p => {
        const finalPath = getPathFromResource(app.root, p);
        const tModule = await manager.resolveTranspiledModuleAsync(
          finalPath,
          null
        );
        tModule.setIsEntry(true);
        return tModule.transpile(manager);
      })
    );

    scriptTModules.forEach(t => {
      t.evaluate(manager, { asUMD: true });
    });

    if (app.environmentSource && app.environments && app.environments.dev) {
      manager.preset.setAdditionalAliases({
        [app.environmentSource]: app.environments.dev,
      });
    }
  }
}

export default function initialize() {
  const preset = new Preset(
    'angular-cli',
    ['web.ts', 'ts', 'json', 'web.tsx', 'tsx', 'js', 'cjs'],
    {},
    {
      setup: async manager => {
        if (!polyfillsLoaded) {
          const zone = await manager.resolveModuleAsync({
            path: 'zone.js',
          });
          await manager.transpileModules(zone);
          manager.evaluateModule(zone);

          if (!manager.configurations['angular-config'].generated) {
            await addAngularJSONPolyfills(manager);
          } else {
            await addAngularCLIPolyfills(manager);
          }

          polyfillsLoaded = true;
        }

        if (!manager.configurations['angular-config'].generated) {
          await addAngularJSONResources(manager);
        } else {
          await addAngularCLIResources(manager);
        }
      },
      processDependencies: deps => {
        if (!deps['@babel/core']) {
          deps['@babel/core'] = '^7.3.3';
        }

        if (!deps['@babel/runtime']) {
          deps['@babel/runtime'] = '^7.3.4';
        }

        // Don't delete babel-runtime, some dependencies rely on it...
        // delete deps['babel-runtime'];
        delete deps['babel-core'];

        return Promise.resolve(deps);
      },
    }
  );

  const postcssWithConfig = {
    transpiler: postcssTranspiler,
    options: {},
  };

  const sassWithConfig = {
    transpiler: sassTranspiler,
    options: {},
  };

  const lessWithConfig = {
    transpiler: lessTranspiler,
    options: {},
  };

  const stylusWithConfig = {
    transpiler: stylusTranspiler,
    options: {},
  };

  const styles = {
    css: [postcssWithConfig],
    scss: [sassWithConfig, postcssWithConfig],
    sass: [sassWithConfig, postcssWithConfig],
    less: [lessWithConfig],
    styl: [stylusWithConfig],
  };

  /**
   * Registers transpilers for all different combinations
   *
   * @returns
   */
  function registerStyleTranspilers() {
    return Object.keys(styles).forEach(type => {
      preset.registerTranspiler(
        module => new RegExp(`\\.${type}$`).test(module.path),
        [...styles[type], { transpiler: stylesTranspiler, options: {} }]
      );
    });
  }

  registerStyleTranspilers();

  preset.registerTranspiler(module => /\.tsx?$/.test(module.path), [
    { transpiler: angular2Transpiler, options: { preTranspilers: styles } },
    { transpiler: typescriptTranspiler },
    { transpiler: csbDynamicImportTranspiler },
  ]);

  preset.registerTranspiler(module => /\.(m|c)?js$/.test(module.path), [
    {
      transpiler: babelTranspiler,
      options: {
        isV7: true,
        config: {
          presets: [
            [
              'env',
              {
                // These targets rougly match csb itself
                targets: '>1%, not ie 11',
                // Users cannot override this behavior because this Babel
                // configuration is highly tuned for ES5 support
                ignoreBrowserslistConfig: true,
                // If users import all core-js they're probably not concerned with
                // bundle size. We shouldn't rely on magic to try and shrink it.
                useBuiltIns: false,
                // Do not transform modules to CJS
                modules: false,
              },
            ],
          ],
          plugins: [['proposal-decorators', { legacy: true }]],
        },
      },
    },
  ]);

  preset.registerTranspiler(module => /\.json$/.test(module.path), [
    { transpiler: jsonTranspiler },
  ]);

  preset.registerTranspiler(() => true, [{ transpiler: rawTranspiler }]);

  return preset;
}
