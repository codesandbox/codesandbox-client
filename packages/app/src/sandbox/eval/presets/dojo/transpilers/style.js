// @flow
import { dispatch } from 'codesandbox-api';
import { StyleTranspiler } from '../../../transpilers/style';
import { type LoaderContext } from '../../../transpiled-module';
import insertCss from '../../../transpilers/style/utils/insert-css';
import toDefinition from '../../../transpilers/style/utils/to-definition';
import getModules from '../../../transpilers/style/get-modules';

const getStyleId = id => id + '-css';

class DojoStyleTranspiler extends StyleTranspiler {
  async doTranspilation(code: string, loaderContext: LoaderContext) {
    const id = getStyleId(loaderContext._module.getId());
    const { path } = loaderContext;
    const modules = loaderContext.getModules();
    let result = modules.find(module => module.path === `${path}.js`);
    if (result) {
      return { transpiledCode: `${insertCss(id, code)}\n${result.code}` };
    }
    const { code: packageJson } = modules.find(
      module => module.path === '/package.json'
    );
    const { name: packageName } = JSON.parse(packageJson);
    const [, baseName] = /\/([^/.]*)[^/]*$/.exec(path);
    const key = `${packageName}/${baseName}`;
    const { css, exportTokens } = await getModules(code, loaderContext);
    result = insertCss(id, css);
    result += `\nmodule.exports=${JSON.stringify({
      ' _key': key,
      ...exportTokens,
    })};`;
    dispatch({ type: 'add-extra-lib', path, code: toDefinition(exportTokens) });
    return { transpiledCode: result };
  }
}

const transpiler = new DojoStyleTranspiler();

export { DojoStyleTranspiler as StyleTranspiler };

export default transpiler;
