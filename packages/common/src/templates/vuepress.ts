// @flow
import Template from './template';
import { decorateSelector } from '../theme';

export default new Template(
  'vuepress',
  'VuePress',
  'https://vuepress.vuejs.org/',
  'github/vicbergquist/codesandbox-vuepress',
  decorateSelector(() => '#4abf8a'),
  {
    mainFile: [], // 🤔
    isServer: true,
    showOnHomePage: true,
  }
);
