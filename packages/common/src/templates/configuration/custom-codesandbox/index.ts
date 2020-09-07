import { ConfigurationFile } from '../types';

const config: ConfigurationFile = {
  title: 'template.json',
  type: 'customTemplate',
  description: 'Configuration for the custom template',
  moreInfoUrl: 'https://codesandbox.io',

  getDefaultCode: () =>
    JSON.stringify(
      {
        templateName: 'custom',
        templateColor: '#aaa',

        sandpack: {
          defaultExtensions: ['js', 'jsx', 'ts', 'tsx', 'json'],
          aliases: {},
          transpilers: {
            '\\.jsx?$': ['codesandbox:babel'],
            '\\.json$': ['codesandbox:json'],
          },
        },
      },
      null,
      2
    ),
};

export default config;
