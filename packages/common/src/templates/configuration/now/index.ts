import { ConfigurationFile } from '../types';

const config: ConfigurationFile = {
  title: 'vercel.json',
  type: 'now',
  description: 'Configuration for your deployments on Vercel.',
  moreInfoUrl:
    'https://vercel.com/docs/configuration#introduction/configuration-reference',

  getDefaultCode: () => JSON.stringify({}, null, 2),
};

export default config;
