import Template, { ViewConfig } from './template';
import { decorateSelector } from '../utils/decorate-selector';

class RustlangTemplate extends Template {
  getViews(): ViewConfig[] {
    const RUSTLANG_VIEWS: ViewConfig[] = [
      {
        views: [
          { id: 'codesandbox.browser' },
          {
            id: 'codesandbox.browser',
            closeable: true,
            options: {
              url: '/___explore',
              title: 'GraphiQL',
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

    return RUSTLANG_VIEWS;
  }
}

export default new RustlangTemplate(
  'rustlang',
  'Rustlang',
  'https://www.rust-lang.org/',
  'github/Kreyren/rustlang-starter-codesandbox',
  decorateSelector(() => '#ba4a00'),
  {
    distDir: 'dist',
    mainFile: ['/src/pages/Index.vue'],
    showOnHomePage: true,
    main: true,
  }
);
