export function genCSSModulesCode(
  id: string,
  index: number,
  request: string,
  moduleName: string | boolean,
  needsHotReload: boolean
): string {
  const styleVar = `style${index}`;
  let code = `\nimport ${styleVar} from ${request}`;

  // inject variable
  const name = typeof moduleName === 'string' ? moduleName : '$style';
  code += `\ncssModules["${name}"] = ${styleVar}`;

  if (needsHotReload) {
    code += `
if (module.hot) {
  module.hot.accept(${request}, () => {
    cssModules["${name}"] = ${styleVar}
    __VUE_HMR_RUNTIME__.rerender("${id}")
  })
}`;
  }

  return code;
}
