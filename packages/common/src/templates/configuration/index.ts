import packageJSON from './package-json';
import prettierRC from './prettierRC';
import sandboxConfig from './sandbox';
import babelrc from './babelrc';
import nowConfig from './now';
import netlifyConfig from './netlify';
import angularCli from './angular-cli';
import angularJSON from './angular-json';
import tsconfig from './tsconfig';
import jsconfig from './jsconfig';
import babelTranspiler from './babel-transpiler';
import customCodeSandbox from './custom-codesandbox';

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
  jsconfig,
};

export default configs;
