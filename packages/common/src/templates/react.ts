import Template from './template';
import { decorateSelector } from '../theme';

import configurations from './configuration';

export default new Template(
  'create-react-app',
  'React',
  'https://github.com/facebookincubator/create-react-app',
  'new',
  decorateSelector(() => '#61DAFB'),
  {
    showOnHomePage: true,
    popular: true,
    main: true,
    mainFile: ['/src/index.js', '/src/index.tsx', '/src/index.ts'],
    extraConfigurations: {
      '/jsconfig.json': configurations.jsconfig,
      '/tsconfig.json': configurations.tsconfig,
    },
  }
);
