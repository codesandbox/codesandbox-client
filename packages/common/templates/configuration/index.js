// @flow
import packageJSON from './package-json';
import prettierRC from './prettierRC';
import sandboxConfig from './sandbox';
import babelrc from './babelrc';
import angularCli from './angular-cli';
import tsconfig from './tsconfig';

const configs = {
  babelrc,
  packageJSON,
  prettierRC,
  sandboxConfig,
  angularCli,
  tsconfig,
};

export default configs;
