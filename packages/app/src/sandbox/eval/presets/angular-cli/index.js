// @flow
import { join, absolute } from '@codesandbox/common/lib/utils/path';
import Preset from '..';

import angular2Transpiler from '../../transpilers/angular2-template';
import typescriptTranspiler from '../../transpilers/typescript';
import babelTranspiler from '../../transpilers/babel';
import jsonTranspiler from '../../transpilers/json';
import stylesTranspiler from '../../transpilers/style';
import sassTranspiler from '../../transpilers/sass';
import rawTranspiler from '../../transpilers/raw';
import stylusTranspiler from '../../transpilers/stylus';
import lessTranspiler from '../../transpilers/less';

let polyfillsLoaded = false;

async function addAngularJSONPolyfills(manager) {
  const { parsed } = manager.configurations['angular-config'];

  const { defaultProject } = parsed;
  const project = parsed.projects[defaultProject];
  const { build } = project.architect;

  if (build.options) {
    if (project.root && build.options.polyfill) {
      const polyfillLocation = absolute(
        join(project.root, build.options.polyfill)
      );
      const polyfills = manager.resolveModule(polyfillLocation, '/');

      await manager.transpileModules(polyfills);
      manager.evaluateModule(polyfills);
    }
  }
}

async function addAngularCLIPolyfills(manager) {
  const { parsed } = manager.configurations['angular-cli'];
  if (parsed.apps && parsed.apps[0]) {
    const app = parsed.apps[0];

    if (app.root && app.polyfills) {
      const polyfillLocation = absolute(join(app.root, app.polyfills));
      const polyfills = manager.resolveModule(polyfillLocation, '/');

      await manager.transpileModules(polyfills);
      manager.evaluateModule(polyfills);
    }
  }
}

async function addAngularJSONResources(manager) {
  const { parsed } = manager.configurations['angular-config'];

  const { defaultProject } = parsed;
  const project = parsed.projects[defaultProject];
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

    const scriptTModules = await Promise.all(
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

async function addAngularCLIResources(manager) {
  const { parsed } = manager.configurations['angular-cli'];
  if (parsed.apps && parsed.apps[0]) {
    const app = parsed.apps[0];

    const { styles = [], scripts = [] } = app;

    /* eslint-disable no-await-in-loop */
    for (let i = 0; i < styles.length; i++) {
      const p = styles[i];
      const finalPath = absolute(join(app.root || 'src', p.input || p));

      const tModule = await manager.resolveTranspiledModuleAsync(
        finalPath,
        null
      );

      await tModule.transpile(manager);
      tModule.setIsEntry(true);
      tModule.evaluate(manager);
    }
    /* eslint-enable no-await-in-loop */

    const scriptTModules = await Promise.all(
      scripts.map(async p => {
        const finalPath = absolute(join(app.root || 'src', p));
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
    ['web.ts', 'ts', 'json', 'web.tsx', 'tsx', 'js'],
    {},
    {
      setup: async manager => {
        if (!polyfillsLoaded) {
          const zone = manager.resolveModule('zone.js', '/');
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
    }
  );

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
    css: [],
    scss: [sassWithConfig],
    sass: [sassWithConfig],
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
        module => new RegExp(`\\.${type}`).test(module.path),
        [...styles[type], { transpiler: stylesTranspiler }]
      );
    });
  }

  registerStyleTranspilers();

  preset.registerTranspiler(module => /\.tsx?$/.test(module.path), [
    { transpiler: angular2Transpiler, options: { preTranspilers: styles } },
    { transpiler: typescriptTranspiler },
  ]);

  preset.registerTranspiler(module => /\.js$/.test(module.path), [
    { transpiler: babelTranspiler },
  ]);

  preset.registerTranspiler(module => /\.json$/.test(module.path), [
    { transpiler: jsonTranspiler },
  ]);

  preset.registerTranspiler(() => true, [{ transpiler: rawTranspiler }]);

  return preset;
}
