// @flow
import DEFAULT_PRETTIER_CONFIG from '../../../prettify-default-config';

import { ConfigurationFile } from '../types';

const config: ConfigurationFile = {
  title: '.prettierrc',
  type: 'prettier',
  description: 'Defines how all files will be prettified by Prettier.',
  moreInfoUrl: 'https://prettier.io/docs/en/configuration.html',
  generateFileFromState: state =>
    JSON.stringify(
      {
        ...DEFAULT_PRETTIER_CONFIG,
        ...(state.get('preferences.settings.prettierConfig') || {}),
      },
      null,
      2
    ),
  schema:
    'https://raw.githubusercontent.com/SchemaStore/schemastore/master/src/schemas/json/prettierrc.json',
};

export default config;
