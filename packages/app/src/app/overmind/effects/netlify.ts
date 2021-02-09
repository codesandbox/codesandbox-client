import getTemplate from '@codesandbox/common/lib/templates';
import { NetlifySite, Sandbox } from '@codesandbox/common/lib/types';
import getNetlifyConfig from 'app/utils/getNetlifyConfig';
import axios from 'axios';

const NetlifyBaseURL = 'https://builder.csbops.io/netlify/site';

type Options = {
  getUserId(): string | null;
  provideJwtToken: () => string | null;
};

export default (() => {
  let _options: Options;
  const createHeaders = (provideJwt: () => string | null) =>
    provideJwt()
      ? {
          Authorization: `Bearer ${provideJwt()}`,
        }
      : {};

  return {
    initialize(options: Options) {
      _options = options;
    },

    async waitForDeploy(id: string, onLogUrlUpdate: (logUrl: string) => void) {
      const url = `${NetlifyBaseURL}/${id}/status`;

      const { data } = await axios.get(url);

      if (data.status.status === 'IN_PROGRESS') {
        await pollUntilDone(axios, url, 10000, 60 * 2000, onLogUrlUpdate);
      }
    },
    async claimSite(sandboxId: string) {
      const userId = _options.getUserId();
      const sessionId = `${userId}-${sandboxId}`;

      const { data } = await axios.post(
        `${NetlifyBaseURL}/${sandboxId}/claim`,
        { sessionId },
        { headers: createHeaders(_options.provideJwtToken) }
      );

      return data.claim;
    },
    async getDeployments(sandboxId: string): Promise<NetlifySite> {
      const response = await axios.get(`${NetlifyBaseURL}/${sandboxId}`, {
        headers: createHeaders(_options.provideJwtToken),
      });
      return response.data;
    },
    async deploy(sandbox: Sandbox): Promise<string> {
      const userId = _options.getUserId();
      const template = getTemplate(sandbox.template);
      const buildCommand = (name: string) => {
        if (name === 'styleguidist') {
          return 'styleguide:build';
        }
        if (name === 'nuxt') {
          return 'generate';
        }

        return 'build';
      };
      const buildConfig = getNetlifyConfig(sandbox);
      // command needs to be passed without the package manager name
      const buildCommandFromConfig = (buildConfig.command || '')
        .replace('npm run', '')
        .replace('yarn ', '');
      let id = '';
      try {
        const { data } = await axios.request({
          url: `${NetlifyBaseURL}/${sandbox.id}`,
          headers: createHeaders(_options.provideJwtToken),
        });

        id = data.site_id;
      } catch (e) {
        const { data } = await axios.post(
          NetlifyBaseURL,
          {
            name: `csb-${sandbox.id}`,
            sessionId: `${userId}-${sandbox.id}`,
          },
          { headers: createHeaders(_options.provideJwtToken) }
        );
        id = data.site_id;
      }
      await axios.post(
        `${NetlifyBaseURL}/${sandbox.id}/deploy`,
        {
          siteId: id,
          dist: buildConfig.publish || template.distDir,
          buildCommand: buildCommandFromConfig || buildCommand(template.name),
        },
        { headers: createHeaders(_options.provideJwtToken) }
      );

      return id;
    },
  };
})();

function delay(t) {
  return new Promise(resolve => {
    setTimeout(resolve, t);
  });
}

function pollUntilDone(http, url, interval, timeout, onLogUrlUpdate) {
  const start = Date.now();
  function run() {
    return http
      .request({ url })
      .then(({ data }) => {
        if (data.status.status !== 'IN_PROGRESS') {
          // DOOOONE
          return data;
        }
        if (timeout !== 0 && Date.now() - start > timeout) {
          return data;
        }

        if (data.status.logUrl) {
          onLogUrlUpdate(data.status.logUrl);
        }
        // run again with a short delay
        return delay(interval).then(run);
      })
      .catch(e => e);
  }
  return run();
}
