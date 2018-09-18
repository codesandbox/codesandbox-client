// @flow
import Template from './template';
import { decorateSelector } from '../theme';
import configurations from './configuration';

export default new Template(
  'next',
  'Next.js',
  'https://nextjs.org/',
  'next',
  decorateSelector(() => '#ffffff'),
  {
    extraConfigurations: {
      '/.babelrc': configurations.babelrc,
    },
    isServer: true,
  }
);
