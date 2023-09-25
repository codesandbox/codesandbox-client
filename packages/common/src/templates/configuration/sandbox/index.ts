import { docsUrl } from '../../../utils/url-generator';
import { ConfigurationFile } from '../types';

const config: ConfigurationFile = {
  title: 'sandbox.config.json',
  type: 'sandbox',
  description: 'Configuration specific to the current sandbox.',
  moreInfoUrl: docsUrl(
    '/learn/browser-sandboxes/configuration#sandbox-configuration'
  ),
  getDefaultCode: () =>
    JSON.stringify(
      {
        infiniteLoopProtection: true,
        hardReloadOnChange: false,
        view: 'browser',
      },
      null,
      2
    ),
};

export default config;
