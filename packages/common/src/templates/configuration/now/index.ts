import { ConfigurationFile } from '../types';

const config: ConfigurationFile = {
  title: 'now.json',
  type: 'now',
  description: 'Configuration for your deployments on ZEIT Now.',
  moreInfoUrl:
    'https://zeit.co/docs/configuration#introduction/configuration-reference',

  getDefaultCode: () => JSON.stringify({}, null, 2),
};

export default config;
