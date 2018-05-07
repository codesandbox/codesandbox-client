// @flow
import type { ConfigurationFile } from '../types';

const config: ConfigurationFile = {
  title: 'babel-transpiler.json',
  type: 'babelTranspiler',
  description: 'Configuration for the Babel REPL.',
  moreInfoUrl: 'https://eslint.org/docs/user-guide/configuring',

  getDefaultCode: () => {
    return '{}';
  },
};

export default config;
