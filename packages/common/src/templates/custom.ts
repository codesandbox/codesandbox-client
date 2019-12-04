import Template from './template';
import { decorateSelector } from '../utils/decorate-selector';
import configurations from './configuration';

export default new Template(
  'custom',
  'Custom',
  'https://codesandbox.io',
  'custom',
  decorateSelector(() => '#F5DA55'),
  {
    extraConfigurations: {
      '/.codesandbox/template.json': configurations.customCodeSandbox,
    },
  }
);
