// @flow
import Template from './template';
import { decorateSelector } from '../theme';
import configurations from './configuration';

export default new Template(
  'next',
  'Next.js',
  'https://nextjs.org/',
  'github/zeit/next.js/tree/master/examples/hello-world',
  decorateSelector(() => '#ffffff'),
  {
    extraConfigurations: {
      '/.babelrc': configurations.babelrc,
    },
    isServer: true,
    mainFile: ['/pages/index.js'],
    backgroundColor: decorateSelector(() => '#000000'),
    showOnHomePage: true,
    main: true,
  }
);
