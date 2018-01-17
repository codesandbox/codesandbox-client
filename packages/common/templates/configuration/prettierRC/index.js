import DEFAULT_PRETTIER_CONFIG from 'common/prettify-default-config';
import ui from './ui';

export default {
  title: '.prettierrc',
  description: 'Defines how all files will be prettified by Prettier.',
  moreInfoUrl: 'https://prettier.io/docs/en/configuration.html',
  ui,
  generateFile: state =>
    JSON.stringify(
      {
        ...DEFAULT_PRETTIER_CONFIG,
        ...(state.get('preferences.settings.prettierConfig') || {}),
      },
      null,
      2
    ),
};
