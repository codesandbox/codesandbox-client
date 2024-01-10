import { decorateSelector } from '../utils/decorate-selector';

import configurations from './configuration';
import { ReactTemplate } from './helpers/react-template';

export default new ReactTemplate(
  'esm-react',
  'React - ESModules',
  'https://github.com/facebookincubator/create-react-app',
  'esm-react',
  decorateSelector(() => '#61DAFB'),
  {
    showOnHomePage: false,
    popular: false,
    main: false,
    mainFile: ['/src/index.js', '/src/index.tsx', '/src/index.ts'],
    extraConfigurations: {
      '/jsconfig.json': configurations.jsconfig,
      '/tsconfig.json': configurations.tsconfig,
    },
  }
);
