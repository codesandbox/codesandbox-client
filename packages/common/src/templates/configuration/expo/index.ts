import { ConfigurationFile } from '../types';

const config: ConfigurationFile = {
  title: 'app.json',
  type: 'expo',
  description: 'Configuration for your universal app.',
  moreInfoUrl: 'https://docs.expo.io/versions/latest/workflow/configuration/',
  partialSupportDisclaimer: `Native app development is not supported in Code Sandbox yet. You can download your project and run it locally, or copy your code to https://snack.expo.io to run your project in the Expo client.`,
  getDefaultCode: () =>
    JSON.stringify({ expo: { platforms: ['web'] } }, null, 2),
};

export default config;
