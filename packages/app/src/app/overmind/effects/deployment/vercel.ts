import getTemplate from '@codesandbox/common/lib/templates';
import {
  Sandbox,
  VercelConfig,
  VercelDeployment,
  VercelUser,
} from '@codesandbox/common/lib/types';
import axios from 'axios';
import { omit } from 'lodash-es';

type Options = {
  getToken(): string | null;
};

interface Object {
  [key: string]: string;
}

interface ApiData {
  builds: Object[];
  config?: Object;
  deploymentType?: string;
  env?: Object;
  files: File[];
  forceNew?: boolean;
  name: string;
  public?: boolean;
  regions: string[];
  routes: Object[];
  scope?: string;
  version: number;
}

interface File {
  data: string;
  encoding?: string;
  file: string;
}

export default (() => {
  let _options: Options;

  function getDefaultHeaders() {
    const token = _options.getToken();

    if (!token) {
      throw new Error('You have no Vercel token');
    }

    return {
      Authorization: `bearer ${token}`,
    };
  }

  async function deploysByID(id) {
    try {
      const response = await axios.get(
        `https://api.vercel.com/v2/now/deployments/${id}/aliases`,
        {
          headers: getDefaultHeaders(),
        }
      );

      return response.data;
    } catch (e) {
      console.error(e);
      return null;
    }
  }

  return {
    initialize(options: Options) {
      _options = options;
    },
    async checkEnvironmentVariables(
      sandbox: Sandbox,
      envVars: {
        [key: string]: string;
      }
    ) {
      const nowData = this.getConfig(sandbox);
      if (!nowData || !nowData.env) return null;
      const all = Object.keys(nowData.env).map(async envVar => {
        const name = nowData.env[envVar].split('@')[1];

        if (envVars[envVar]) {
          try {
            await axios.post(
              `https://api.vercel.com/v3/now/secrets/`,
              {
                name,
                value: envVars[envVar],
              },
              { headers: getDefaultHeaders() }
            );
            // We don't do anything with the error for two main reasons
            // 1 - Vercel already shows an error if a ENV variable is missing and you try to deploy
            // 2 - This will also fail if the user already has the secret in their account
            // eslint-disable-next-line no-empty
          } catch {}
        }
      });

      await Promise.all(all);

      return null;
    },
    getConfig(sandbox: Sandbox): VercelConfig {
      const nowConfigs = sandbox.modules
        .filter(
          m =>
            m.title === 'vercel.json' ||
            m.title === 'now.json' ||
            (m.title === 'package.json' && JSON.parse(m.code).now)
        )
        .map(c => JSON.parse(c.code));
      const nowData = nowConfigs[0] || {};

      if (!nowData.name) {
        nowData.name = `csb-${sandbox.id}`;
      }

      return nowData;
    },
    async getDeployments(name: string): Promise<VercelDeployment[]> {
      const response = await axios.get<{ deployments: VercelDeployment[] }>(
        'https://api.vercel.com/v4/now/deployments',
        {
          headers: getDefaultHeaders(),
        }
      );

      const deploysNoAlias = response.data.deployments
        .filter(d => d.name === name)
        .sort((a, b) => (a.created < b.created ? 1 : -1));

      const assignAlias = async d => {
        const alias = await deploysByID(d.uid);
        if (alias) {
          // eslint-disable-next-line
          d.alias = alias.aliases;
        } else {
          d.alias = [];
        }
        return d;
      };

      return Promise.all(deploysNoAlias.map(assignAlias));
    },
    async getUser(): Promise<VercelUser> {
      const response = await axios.get('https://api.vercel.com/www/user', {
        headers: getDefaultHeaders(),
      });

      return response.data.user;
    },
    async deleteDeployment(id: string): Promise<VercelDeployment[]> {
      const response = await axios.delete(
        `https://api.vercel.com/v9/now/deployments/${id}`,
        {
          headers: getDefaultHeaders(),
        }
      );
      return response.data.deployments;
    },
    async deploy(contents: any, sandbox: Sandbox): Promise<string> {
      const apiData = await getApiData(contents, sandbox);
      const deploymentVersion = apiData.version === 2 ? 'v9' : 'v3';

      const response = await axios.post(
        `https://api.vercel.com/${deploymentVersion}/now/deployments?forceNew=1`,
        apiData,
        {
          headers: getDefaultHeaders(),
        }
      );

      return `https://${response.data.url}`;
    },
    async aliasDeployment(
      id: string,
      vercelConfig: VercelConfig
    ): Promise<string> {
      const response = await axios.post(
        `https://api.vercel.com/v2/now/deployments/${id}/aliases`,
        { alias: vercelConfig.alias },
        {
          headers: getDefaultHeaders(),
        }
      );

      return `https://${response.data.alias}`;
    },
  };
})();

async function getApiData(contents: any, sandbox: Sandbox) {
  const template = getTemplate(sandbox.template);

  let apiData: Partial<ApiData> = {
    files: [],
  };
  let packageJSON: any = {};
  let nowJSON: any = {};

  const projectPackage = contents.files['package.json'];
  const nowFile = contents.files['vercel.json'] || contents.files['now.json'];

  if (projectPackage) {
    const data = await projectPackage.async('text'); // eslint-disable-line no-await-in-loop

    const parsed = JSON.parse(data);
    packageJSON = parsed;
  }

  if (nowFile) {
    const data = await nowFile.async('text'); // eslint-disable-line no-await-in-loop

    const parsed = JSON.parse(data);
    nowJSON = parsed;
  } else if (packageJSON.now) {
    // Also support package.json if imported like that
    nowJSON = packageJSON.now;
  }

  const nowDefaults: Pick<ApiData, 'name'> = {
    name: `csb-${sandbox.id}`,
  };

  const filePaths = nowJSON.files || Object.keys(contents.files);

  // We'll omit the homepage-value from package.json as it creates wrong assumptions over the now deployment environment.
  packageJSON = omit(packageJSON, 'homepage');

  // if the template is static we should not have a build command
  if (template.name === 'static') {
    packageJSON = omit(packageJSON, 'scripts.build');
  }
  // We force the sandbox id, so Vercel will always group the deployments to a
  // single sandbox
  packageJSON.name = nowJSON.name || nowDefaults.name;

  apiData.name = nowJSON.name || nowDefaults.name;
  apiData.deploymentType = nowJSON.type;
  if (nowJSON.public) {
    apiData.public = nowJSON.public;
  }

  // We need to tell now the version, builds and routes
  apiData.version = 2;
  apiData.builds = nowJSON.builds;
  apiData.routes = nowJSON.routes;
  apiData.env = nowJSON.env;
  apiData.scope = nowJSON.scope;
  apiData['build.env'] = nowJSON['build.env'];
  apiData.regions = nowJSON.regions;

  if (!nowJSON.files && apiData?.files) {
    apiData.files.push({
      file: 'package.json',
      data: JSON.stringify(packageJSON, null, 2),
    });
  }

  for (let i = 0; i < filePaths.length; i += 1) {
    const filePath = filePaths[i];
    const file = contents.files[filePath];

    if (!file.dir && filePath !== 'package.json' && apiData?.files) {
      const data = await file.async('base64'); // eslint-disable-line no-await-in-loop

      apiData.files.push({ file: filePath, data, encoding: 'base64' });
    }

    // if person added some files but no package.json
    if (
      filePath === 'package.json' &&
      apiData?.files &&
      !apiData.files.find(f => f.file === 'package.json')
    ) {
      apiData.files.push({
        file: 'package.json',
        data: JSON.stringify(packageJSON, null, 2),
      });
    }
  }

  // this adds unnecessary code for version 2
  // packages/common/templates/template.js
  if (template.alterDeploymentData && nowJSON.version !== 2) {
    apiData = template.alterDeploymentData(apiData);
  }

  return apiData;
}
