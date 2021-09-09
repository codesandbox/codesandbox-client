import jsxPlugin from '@svgr/plugin-jsx';
import { expandState } from '@svgr/core/lib/state';
import { getPlugins, resolvePlugin } from '@svgr/core/lib/plugins';

export async function svgrTransform(filePath: string, inputCode: string) {
  const config = {};
  const state = {
    caller: {
      name: '@codesandbox/svgr-loader',
      defaultPlugins: [jsxPlugin],
    },
    filePath,
  };
  const expandedState = expandState(state);
  const plugins = getPlugins(config, state).map(resolvePlugin);
  let code = String(inputCode).replace('\0', '');
  // eslint-disable-next-line no-restricted-syntax
  for (const plugin of plugins) {
    code = plugin(code, config, expandedState);
  }
  return code;
}
