import { ConfigurationFile } from '../types';

const config: ConfigurationFile = {
  title: 'netlify.toml',
  type: 'netlify',
  description: 'Configuration for your deployments in netlify.',
  moreInfoUrl: 'https://www.netlify.com/docs/netlify-toml-reference/',

  getDefaultCode: () =>
    '# Please use only NPM and not yarn as the bot only has NPM',
};

export default config;
