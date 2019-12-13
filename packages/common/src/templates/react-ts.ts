import { decorateSelector } from '../utils/decorate-selector';
import { ReactTemplate } from './helpers/react-template';

import configurations from './configuration';

export default new ReactTemplate(
  'create-react-app-typescript',
  'React + TS',
  'https://github.com/wmonk/create-react-app-typescript',
  'react-ts',
  decorateSelector(() => '#009fff'),
  {
    isTypescript: true,
    showOnHomePage: false,
    extraConfigurations: {
      '/tsconfig.json': configurations.tsconfig,
    },
  }
);
