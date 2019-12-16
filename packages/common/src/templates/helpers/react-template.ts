import Template, { ViewConfig } from '../template';

export class ReactTemplate extends Template {
  getViews(): ViewConfig[] {
    const REACT_VIEWS: ViewConfig[] = [
      {
        views: [{ id: 'codesandbox.browser' }, { id: 'codesandbox.tests' }],
      },
      {
        open: true,
        views: [
          { id: 'codesandbox.console' },
          { id: 'codesandbox.problems' },
          { id: 'codesandbox.react-devtools' },
        ],
      },
    ];

    return REACT_VIEWS;
  }
}
