import { decorateSelector } from '../utils/decorate-selector';

import configurations from './configuration';
import { ReactTemplate } from './helpers/react-template';

export default new ReactTemplate(
  'create-react-app',
  'React',
  'https://github.com/facebookincubator/create-react-app',
  'new',
  decorateSelector(() => '#61DAFB'),
  {
    showOnHomePage: true,
    popular: true,
    main: true,
    mainFile: [
      '/src/index.js',
      '/src/index.tsx',
      '/src/index.ts',
      '/src/main.tsx',
      '/src/main.ts',
      '/src/main.js',
    ],
    extraConfigurations: {
      '/jsconfig.json': configurations.jsconfig,
      '/tsconfig.json': configurations.tsconfig,
    },
  }
);
