import Template from './template';
import { decorateSelector } from '../theme';
import configurations from './configuration';

export default new Template(
  'expo-cli',
  'Expo',
  'https://expo.io/',
  'github/expo/web-examples/tree/master/code-sandbox-template',
  decorateSelector(() => '#fff'),
  {
    backgroundColor: decorateSelector(() => '#4630EB'),
    extraConfigurations: {
      '/app.json': configurations.expoConfig,
    },
    main: true,
    mainFile: ['node_modules/expo/AppEntry.js', '/index.js'],
    showOnHomePage: true,
  }
);
