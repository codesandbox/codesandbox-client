import getTemplate from '@codesandbox/common/lib/templates';
import { Sandbox } from '@codesandbox/common/lib/types';
import axios from 'axios';

const GHPagesBaseUrl = 'https://builder.csbops.io/gh-pages/';

type Options = {
  getEmail: () => string;
  provideJwtToken: () => Promise<string>;
};

export default (() => {
  let _options: Options;
  let _jwtToken: string | null;
  const createHeaders = (jwt: string | null) =>
    jwt
      ? {
          Authorization: `Bearer ${jwt}`,
        }
      : {};

  return {
    initialize(options: Options) {
      _options = options;
    },
    async provideJwtCached() {
      if (!_jwtToken) {
        try {
          const token = await _options.provideJwtToken();
          setTimeout(() => {
            // Token expires after 10 seconds, for safety we actually cache the token
            // for 5 seconds
            _jwtToken = undefined;
          }, 5000);
          return token;
        } catch (e) {
          _jwtToken = undefined;
          return Promise.reject(e);
        }
      }

      return _jwtToken;
    },

    async getLogs(id: string) {
      const url = `${GHPagesBaseUrl}/${id}/status`;
      const token = await this.provideJwtCached();

      const { data } = await axios.get(url, {
        headers: createHeaders(token),
      });

      return data;
    },

    async deploy(sandbox: Sandbox): Promise<any> {
      const token = await this.provideJwtCached();
      const email = _options.getEmail();
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

      const website = await axios.post(
        `${GHPagesBaseUrl}/${sandbox.id}`,
        {
          dist: template.distDir,
          buildCommand: buildCommand(template.name),
          username: email,
        },
        { headers: createHeaders(token) }
      );

      return website;
    },
  };
})();
