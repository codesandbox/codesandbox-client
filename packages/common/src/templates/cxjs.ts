import Template from './template';
import { decorateSelector } from '../utils/decorate-selector';
import configurations from './configuration';

class CxJSTemplate extends Template {
  getEntries() {
    return ['/app/index.js', '/src/index.js', '/index.html'];
  }

  getHTMLEntries() {
    return ['/app/index.html', '/src/index.html', '/index.html'];
  }
}

export default new CxJSTemplate(
  'cxjs',
  'CxJS',
  'https://cxjs.io/',
  'github/codaxy/cxjs-codesandbox-template',
  decorateSelector(() => '#11689f'),
  {
    showOnHomePage: true,
    showCube: false,
    extraConfigurations: {
      '/.babelrc': configurations.babelrc,
      '/tsconfig.json': configurations.tsconfig,
    },
    externalResourcesEnabled: false,
    distDir: 'dist',
  }
);
