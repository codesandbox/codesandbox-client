import { AsyncAction } from 'app/overmind';
import { omit } from 'lodash-es';
import getTemplate from '@codesandbox/common/lib/templates';
import getNetlifyConfig from 'app/utils/getNetlifyConfig';
import pollUntilDone from '../../utils/pollUntilDone';
import { NetlifyBaseURL } from 'app/overmind/constants';
import { NetlifySite } from './state';

export const createZip: AsyncAction<void, { file: any }> = async ({
  state,
  effects,
}) => {
  const sandboxId = state.editor.currentId;
  const sandbox = state.editor.sandboxes[sandboxId];
  const result = await effects.utils.getZip(sandbox);

  return result.file;
};

export const getNetlifyDeploys: AsyncAction<void, NetlifySite> = async ({
  effects,
  state,
}) => {
  const sandboxId = state.editor.currentId;

  const { data } = await effects.http.get(`${NetlifyBaseURL}/${sandboxId}`, {});

  return data.result;
};

export const claimNetlifyWebsite: AsyncAction<void, any> = async ({
  effects,
  state,
}) => {
  const userId = state.user.id;
  const sandboxId = state.editor.currentId;
  const sessionId = `${userId}-${sandboxId}`;

  const { data } = await effects.http.get(
    `${NetlifyBaseURL}-claim?sessionId=${sessionId}`
  );

  return data.claim;
};

export const deployToNetlify: AsyncAction<any, string> = async (
  { effects, state },
  file
) => {
  state.deployment.netlifyLogs = null;

  const userId = state.user.id;
  const sandboxId = state.editor.currentId;
  const sandbox = state.editor.sandboxes[sandboxId];
  const template = getTemplate(sandbox.template);
  const buildCommand = (name: string) => {
    if (name === 'styleguidist') return 'styleguide:build';
    if (name === 'nuxt') return 'generate';

    return 'build';
  };
  const buildConfig = getNetlifyConfig(sandbox);
  // command needs to be passed without the package manager name
  const buildCommandFromConfig = (buildConfig.command || '')
    .replace('npm run', '')
    .replace('yarn ', '');
  let id = '';
  try {
    const { data } = await effects.http.request({
      url: `${NetlifyBaseURL}/${sandboxId}`,
    });

    id = data.site_id;
  } catch (e) {
    const { data } = await effects.http.post(NetlifyBaseURL, {
      name: `csb-${sandboxId}`,
      session_id: `${userId}-${sandboxId}`,
    });
    id = data.site_id;
  }

  await effects.http.post(
    `${NetlifyBaseURL}/${sandboxId}/deploys?siteId=${id}&dist=${buildConfig.publish ||
      template.distDir}&buildCommand=${buildCommandFromConfig ||
      buildCommand(template.name)}`,
    file,
    {
      headers: {
        'Content-Type': 'application/zip',
      },
    }
  );

  return id;
};

export const getStatus: AsyncAction<string> = async (
  { effects, state },
  id
) => {
  const url = `${NetlifyBaseURL}/${id}/status`;

  const { data } = await effects.http.get(url);

  if (data.status.status === 'IN_PROGRESS') {
    await pollUntilDone(effects.http, url, 10000, 60 * 2000, state);
  }
};

export const getDeploymentData: AsyncAction<
  void,
  { name?: string; alias?: string }
> = async ({ state }) => {
  const sandbox = state.editor.currentSandbox;
  const nowData: { name?: string; alias?: string } =
    sandbox.modules
      .filter(
        m => m.title === 'now.json' || (m.title === 'package.json' && m.now)
      )
      .map(c => JSON.parse(c.code))[0] || {};

  if (!nowData.name) {
    nowData.name = `csb-${sandbox.id}`;
  }

  state.deployment.hasAlias = !!nowData.alias;

  return nowData;
};

export const getDeploys: AsyncAction<
  {
    name?: string;
    alias?: string;
  },
  any[]
> = async ({ effects, state }, nowData) => {
  const token = state.user.integrations.zeit.token;

  const { data } = await effects.http.get(
    'https://api.zeit.co/v3/now/deployments',
    {
      headers: { Authorization: `bearer ${token}` },
    }
  );
  const deploys = data.result.deployments;

  const deploysNoAlias = deploys
    .filter(d => d.name === nowData.name)
    .sort((a, b) => (a.created < b.created ? 1 : -1));

  const assignAlias = async d => {
    try {
      const { data } = await effects.http.get(
        `https://api.zeit.co/v3/now/deployments/${d.uid}/aliases`,
        {
          headers: { Authorization: `bearer ${token}` },
        }
      );

      const alias = data.result;

      d.alias = alias.aliases;

      return d;
    } catch (e) {
      console.error(e);
      return null;
    }
  };

  return Promise.all(deploysNoAlias.map(assignAlias));
};

export const createApiData: AsyncAction<any> = async ({ state }, contents) => {
  const sandboxId = state.editor.currentId;
  const sandbox = state.editor.sandboxes[sandboxId];
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
  if (nowJSON.version === 2) {
    apiData.version = 2;
    apiData.builds = nowJSON.builds;
    apiData.routes = nowJSON.routes;
    apiData.env = nowJSON.env;
    apiData.scope = nowJSON.scope;
    apiData['build.env'] = nowJSON['build.env'];
    apiData.regions = nowJSON.regions;
  } else {
    apiData.config = omit(nowJSON, ['public', 'type', 'name', 'files']);
    apiData.forceNew = true;
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
      !apiData.files.filter(f => f.name === 'package.json')
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
};

export const postToZeit: AsyncAction<any, string> = async (
  { state, effects },
  apiData
) => {
  const token = state.user.integrations.zeit.token;
  const deploymentVersion = apiData.version === 2 ? 'v6' : 'v3';

  const response = await effects.http.request({
    url: `https://api.zeit.co/${deploymentVersion}/now/deployments?forceNew=1`,
    data: apiData,
    method: 'POST',
    headers: { Authorization: `bearer ${token}` },
  });

  return `https://${response.data.result.url}`;
};

export const deleteDeployment: AsyncAction<string> = async (
  { effects, state },
  id
) => {
  const token = state.user.integrations.zeit.token;

  await effects.http.request({
    url: `https://api.zeit.co/v2/now/deployments/${id}`,
    method: 'DELETE',
    headers: { Authorization: `bearer ${token}` },
  });
};

export const aliasDeployment: AsyncAction<
  {
    nowData: any;
    id: string;
  },
  string
> = async ({ effects, state }, { nowData, id }) => {
  const token = state.user.integrations.zeit.token;
  const response = await effects.http.request({
    url: `https://api.zeit.co/v2/now/deployments/${id}/aliases`,
    data: { alias: nowData.alias },
    method: 'POST',
    headers: { Authorization: `bearer ${token}` },
  });

  return `https://${response.data.result.alias}`;
};
