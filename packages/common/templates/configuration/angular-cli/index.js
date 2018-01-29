// @flow
import type { ConfigurationFile } from '../types';

const config: ConfigurationFile = {
  title: '.angular-cli.json',
  type: 'angular-cli',
  description:
    'The configuration used for angular-cli, the cli to run angular projects.',
  moreInfoUrl: 'https://github.com/angular/angular-cli/wiki/angular-cli',

  getDefaultCode: () =>
    JSON.stringify(
      {
        apps: [
          {
            root: 'src',
            outDir: 'dist',
            index: 'index.html',
            main: 'main.ts',
            polyfills: 'polyfills.ts',
            styles: [],
            scripts: [],
          },
        ],
      },
      null,
      2
    ),
};

export default config;
