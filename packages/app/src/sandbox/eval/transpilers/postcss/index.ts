import { LoaderContext, Transpiler } from 'sandpack-core';

const FEATURE_REGEX = /@import|@url/;

/**
 * Mainly responsible for inlining css imports
 */
class PostCSSCompiler extends Transpiler {
  constructor() {
    super('postcss-compiler');
  }

  doTranspilation(code: string, loaderContext: LoaderContext) {
    // 此处是判断如果样式文件中包含 @import 或者 @url 时，才使用 postcss 处理，减少对非必要样式文件的处理，提升性能
    // 因为 postcss 只包含 postcss-import 时这里的逻辑没问题
    // 但加入了其他 postcss 插件用来处理其他功能时，例如 postcss-px-to-viewport 转换 px 单位时，就不能还使用该逻辑了
    // 还需要判断是否存在 postcss 的配置项 postcssConfig
    const {
      postcssConfig,
    } = loaderContext.options.configurations.sandbox.parsed;
    if (!postcssConfig && !FEATURE_REGEX.test(code)) {
      return Promise.resolve({ transpiledCode: code });
    }
    return import(
      /* webpackChunkName: 'postcss-compiler' */ './loader'
    ).then(loader => loader.default(code, loaderContext));
  }
}

const transpiler = new PostCSSCompiler();

export { PostCSSCompiler };

export default transpiler;
