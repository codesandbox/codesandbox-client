import Template from './template';
import { decorateSelector } from '../utils/decorate-selector';
import configurations from './configuration';

export default new Template(
  'babel-repl',
  'Babel',
  'https://github.com/@babel/core',
  'babel',
  decorateSelector(() => '#F5DA55'),
  {
    extraConfigurations: {
      '/.babelrc': configurations.babelrc,
      '/babel-transpiler.json': configurations.babelTranspiler,
    },
  }
);
