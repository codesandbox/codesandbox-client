import Template, { ViewConfig } from './template';
import { decorateSelector } from '../theme';
import configurations from './configuration';

class GatsbyTemplate extends Template {
  getViews(): ViewConfig[] {
    console.log('sup');
    const GATSBY_VIEWS: ViewConfig[] = [
      {
        views: [
          { id: 'codesandbox.browser' },
          {
            id: 'codesandbox.browser',
            closeable: true,
            options: {
              port: 8080,
              url: '/___graphql',
              name: 'GraphiQL',
            },
          },
        ],
      },
      {
        open: true,
        views: [
          { id: 'codesandbox.terminal' },
          { id: 'codesandbox.console' },
          { id: 'codesandbox.problems' },
        ],
      },
    ];

    return GATSBY_VIEWS;
  }
}

export default new GatsbyTemplate(
  'gatsby',
  'Gatsby',
  'https://www.gatsbyjs.org/',
  'github/gatsbyjs/gatsby-starter-default',
  decorateSelector(() => '#8C65B3'),
  {
    extraConfigurations: {
      '/.babelrc': configurations.babelrc,
    },
    distDir: 'public',
    isServer: true,
    mainFile: ['/src/pages/index.js'],
    showOnHomePage: true,
    main: true,
    popular: true,
    showCube: false,
  }
);
