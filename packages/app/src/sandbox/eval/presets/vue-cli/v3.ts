import { TranspilerDefinition, Preset } from 'sandpack-core';
import babelTranspiler from '../../transpilers/babel';
import typescriptTranspiler from '../../transpilers/typescript';
import jsonTranspiler from '../../transpilers/json';
import stylesTranspiler from '../../transpilers/style';
import sassTranspiler from '../../transpilers/sass';
import rawTranspiler from '../../transpilers/raw';
import stylusTranspiler from '../../transpilers/stylus';
import lessTranspiler from '../../transpilers/less';
import noopTranspiler from '../../transpilers/noop';
import binaryTranspiler from '../../transpilers/binary';
import base64Transpiler from '../../transpilers/base64';
import pugTranspiler from '../../transpilers/pug';
import coffeeTranspiler from '../../transpilers/coffee';

export default async function initialize(vuePreset: Preset) {
  const { stylePostLoader, vueLoader, templateLoader } = await import(
    'vue3-transpiler/lib/transpilers'
  );

  const sassWithConfig: TranspilerDefinition = {
    transpiler: sassTranspiler,
    options: {
      indentedSyntax: true,
    },
  };

  const scssWithConfig: TranspilerDefinition = {
    transpiler: sassTranspiler,
    options: {},
  };

  const lessWithConfig: TranspilerDefinition = {
    transpiler: lessTranspiler,
    options: {},
  };

  const stylusWithConfig: TranspilerDefinition = {
    transpiler: stylusTranspiler,
    options: {},
  };

  /**
   * Registers transpilers for all different combinations
   *
   * @returns
   */
  function registerStyleTranspilers() {
    const styles = {
      css: [],
      scss: [scssWithConfig],
      sass: [sassWithConfig],
      less: [lessWithConfig],
      styl: [stylusWithConfig],
    };

    return Object.keys(styles).forEach(type => {
      vuePreset.registerTranspiler(
        module => new RegExp(`\\.${type}$`).test(module.path),
        [
          ...styles[type],
          { transpiler: stylesTranspiler, options: { hmrEnabled: true } },
        ]
      );
    });
  }

  vuePreset.registerTranspiler(module => /\.(m|c)?jsx?$/.test(module.path), [
    { transpiler: babelTranspiler },
  ]);
  vuePreset.registerTranspiler(module => /\.m?tsx?$/.test(module.path), [
    { transpiler: typescriptTranspiler },
    { transpiler: babelTranspiler },
  ]);
  vuePreset.registerTranspiler(module => /\.json$/.test(module.path), [
    { transpiler: jsonTranspiler },
  ]);
  vuePreset.registerTranspiler(module => /\.vue$/.test(module.path), [
    { transpiler: vueLoader },
    { transpiler: babelTranspiler },
  ]);
  vuePreset.registerTranspiler(module => /\.coffee$/.test(module.path), [
    { transpiler: coffeeTranspiler },
    { transpiler: babelTranspiler },
  ]);

  registerStyleTranspilers();

  vuePreset.registerTranspiler(() => false, [{ transpiler: templateLoader }]);
  vuePreset.registerTranspiler(() => false, [{ transpiler: stylePostLoader }]);

  vuePreset.registerTranspiler(module => /\.png$/.test(module.path), [
    { transpiler: binaryTranspiler },
    { transpiler: base64Transpiler },
  ]);
  vuePreset.registerTranspiler(module => /!noop/.test(module.path), [
    { transpiler: noopTranspiler },
  ]);
  vuePreset.registerTranspiler(() => true, [{ transpiler: rawTranspiler }]);
  vuePreset.registerTranspiler(module => /\.pug$/.test(module.path), [
    { transpiler: pugTranspiler },
  ]);

  return vuePreset;
}
