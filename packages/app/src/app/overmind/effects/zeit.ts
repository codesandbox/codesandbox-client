import axios from 'axios';
import {
  ZeitUser,
  Sandbox,
  ZeitDeployment,
  ZeitConfig,
} from '@codesandbox/common/lib/types';
import getTemplate from '@codesandbox/common/lib/templates';
import { omit } from 'lodash-es';

type Options = {
  getToken(): string;
};

export default (() => {
  let _options: Options;

  function getDefaultHeaders() {
    const token = _options.getToken();

    if (!token) {
      throw new Error('You have no Zeit token');
    }

    return {
      Authorization: `bearer ${token}`,
    };
  }

  async function deploysByID(id) {
    try {
      const response = await axios.get(
        `https://api.zeit.co/v2/now/deployments/${id}/aliases`,
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
    getConfig(sandbox: Sandbox): ZeitConfig {
      const nowConfigs = sandbox.modules
        .filter(
          m => m.title === 'now.json' || (m.title === 'package.json' && m.now)
        )
        .map(c => JSON.parse(c.code));
      const nowData = nowConfigs[0] || {};

      if (!nowData.name) {
        nowData.name = `csb-${sandbox.id}`;
      }

      return nowData;
    },
    async getDeployments(name: string): Promise<ZeitDeployment[]> {
      const response = await axios.get<{ deployments: ZeitDeployment[] }>(
        'https://api.zeit.co/v4/now/deployments',
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
    async getUser(): Promise<ZeitUser> {
      const response = await axios.get('https://api.zeit.co/www/user', {
        headers: getDefaultHeaders(),
      });

      return response.data.user;
    },
    async deleteDeployment(id: string): Promise<ZeitDeployment[]> {
      const response = await axios.delete(
        `https://api.zeit.co/v9/now/deployments/${id}`,
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
        `https://api.zeit.co/${deploymentVersion}/now/deployments?forceNew=1`,
        apiData,
        {
          headers: getDefaultHeaders(),
        }
      );

      return `https://${response.data.url}`;
    },
    async aliasDeployment(id: string, zeitConfig: ZeitConfig): Promise<string> {
      const response = await axios.post(
        `https://api.zeit.co/v2/now/deployments/${id}/aliases`,
        { alias: zeitConfig.alias },
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

  let apiData: any = {
    files: [],
  };
  let packageJSON: any = {};
  let nowJSON: any = {};

  const projectPackage = contents.files['package.json'];
  const nowFile = contents.files['now.json'];

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

  const nowDefaults: any = {
    name: `csb-${sandbox.id}`,
    public: true,
  };

  const filePaths = nowJSON.files || Object.keys(contents.files);

  // We'll omit the homepage-value from package.json as it creates wrong assumptions over the now deployment environment.
  packageJSON = omit(packageJSON, 'homepage');

  // We force the sandbox id, so ZEIT will always group the deployments to a
  // single sandbox
  packageJSON.name = nowJSON.name || nowDefaults.name;

  apiData.name = nowJSON.name || nowDefaults.name;
  apiData.deploymentType = nowJSON.type || nowDefaults.type;
  apiData.public = nowJSON.public || nowDefaults.public;

  // if now v2 we need to tell now the version, builds and routes
  if (nowJSON.version === 1) {
    apiData.config = omit(nowJSON, [
      'public',
      'type',
      'name',
      'files',
      'version',
    ]);
    apiData.forceNew = true;
  } else {
    apiData.version = 2;
    apiData.builds = nowJSON.builds;
    apiData.routes = nowJSON.routes;
    apiData.env = nowJSON.env;
    apiData.scope = nowJSON.scope;
    apiData['build.env'] = nowJSON['build.env'];
    apiData.regions = nowJSON.regions;
  }

  if (!nowJSON.files) {
    apiData.files.push({
      file: 'package.json',
      data: JSON.stringify(packageJSON, null, 2),
    });
  }

  for (let i = 0; i < filePaths.length; i += 1) {
    const filePath = filePaths[i];
    const file = contents.files[filePath];

    if (!file.dir && filePath !== 'package.json') {
      const data = await file.async('base64'); // eslint-disable-line no-await-in-loop

      apiData.files.push({ file: filePath, data, encoding: 'base64' });
    }

    // if person added some files but no package.json
    if (
      filePath === 'package.json' &&
      !apiData.files.find(f => f.name === 'package.json')
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
