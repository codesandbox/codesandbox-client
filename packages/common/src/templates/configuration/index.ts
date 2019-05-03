import packageJSON from './package-json';
import prettierRC from './prettierRC';
import sandboxConfig from './sandbox';
import babelrc from './babelrc';
import nowConfig from './now';
import netlifyConfig from './netlify';
import angularCli from './angular-cli';
import angularJSON from './angular-json';
import tsconfig from './tsconfig';
import babelTranspiler from './babel-transpiler';
import customCodeSandbox from './custom-codesandbox';
import expoConfig from './expo';

const configs = {
  babelrc,
  babelTranspiler,
  packageJSON,
  prettierRC,
  sandboxConfig,
  angularCli,
  angularJSON,
  tsconfig,
  customCodeSandbox,
  nowConfig,
  netlifyConfig,
  expoConfig,
};

export default configs;
