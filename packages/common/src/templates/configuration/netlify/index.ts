import { ConfigurationFile } from '../types';

const config: ConfigurationFile = {
  title: 'netlify.toml',
  type: 'netlify',
  description: 'Configuration for your deployments in netlify.',
  moreInfoUrl: 'https://www.netlify.com/docs/netlify-toml-reference/',

  getDefaultCode: () => '',
};

export default config;
