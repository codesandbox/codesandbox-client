import Template, { ViewConfig, ParsedConfigurationFiles } from '../template';

export class ReactTemplate extends Template {
  getViews(): ViewConfig[] {
    const REACT_VIEWS: ViewConfig[] = [
      {
        views: [
          { id: 'codesandbox.browser' },
          { id: 'codesandbox.tests' },
          {
            id: 'codesandbox.terminalUpgrade',
            hideOnEmbedPage: true,
            hideOnPrem: true,
          },
        ],
      },
      {
        views: [
          { id: 'codesandbox.console' },
          { id: 'codesandbox.problems' },
          { id: 'codesandbox.react-devtools' },
        ],
      },
    ];

    return REACT_VIEWS;
  }

  getDefaultOpenedFiles(configurationFiles: ParsedConfigurationFiles) {
    let entries = [];

    entries.push('/src/App.js');
    entries.push('/src/App.tsx');
    entries = entries.concat(this.getEntries(configurationFiles));

    return entries;
  }
}
