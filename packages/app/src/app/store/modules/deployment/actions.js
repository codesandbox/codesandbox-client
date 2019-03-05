import { omit } from 'lodash-es';
import getTemplate from 'common/lib/templates';

// function delay(t) {
//   return new Promise(resolve => {
//     setTimeout(resolve, t);
//   });
// }

// // interval is how often to poll
// // timeout is how long to poll waiting for a result (0 means try forever)
// // url is the URL to request
// function pollUntilDone(http, url, interval, timeout) {
//   const start = Date.now();
//   function run() {
//     return http.request({ url }).then(dataResult => {
//       console.log(dataResult, 'dataResult');
//       if (dataResult.status === 'DONE') {
//         // we know we're done here, return from here whatever you
//         // want the final resolved value of the promise to be
//         return dataResult;
//       }
//       if (timeout !== 0 && Date.now() - start > timeout) {
//         throw new Error('timeout error on pollUntilDone');
//       } else {
//         // run again with a short delay
//         return delay(interval).then(run);
//       }
//     });
//   }
//   return run();
// }

export function createZip({ utils, state }) {
  const sandboxId = state.get('editor.currentId');
  const sandbox = state.get(`editor.sandboxes.${sandboxId}`);
  return utils.getZip(sandbox).then(result => ({ file: result.file }));
}

export function loadZip({ props, jsZip }) {
  const { file } = props;

  return jsZip.loadAsync(file).then(result => ({ contents: result }));
}

const NetlifyBaseURL = 'https://netlify-deploy.now.sh/site';

export async function claimNetlifyWebsite({ http, state, path }) {
  const userId = state.get('user.id');
  const sandboxId = state.get('editor.currentId');
  const sessionId = `${userId}-${sandboxId}`;

  const { result } = await http.request({
    url: `${NetlifyBaseURL}-claim?sessionId=${sessionId}`,
  });

  return path.success({
    claimURL: result.claim,
  });
}

export async function getNetlifyDeploys({ http, state, path }) {
  const sandboxId = state.get('editor.currentId');

  try {
    const site = await http.request({
      url: `${NetlifyBaseURL}/${sandboxId}`,
    });

    return path.success({
      site: site.result,
    });
  } catch (error) {
    return path.error({ error });
  }
}

export async function deployToNetlify({ path, http, props, state }) {
  const { file } = props;
  const userId = state.get('user.id');
  const sandboxId = state.get('editor.currentId');
  const sandbox = state.get(`editor.sandboxes.${sandboxId}`);
  const template = getTemplate(sandbox.template);
  const buildCommand = template.name === 'nuxt' ? 'generate' : 'build';
  let id = '';
  try {
    const { result } = await http.request({
      url: `${NetlifyBaseURL}/${sandboxId}`,
    });

    id = result.site_id;
  } catch (e) {
    const { result } = await http.request({
      url: NetlifyBaseURL,
      method: 'POST',
      body: {
        name: `csb-${sandboxId}`,
        session_id: `${userId}-${sandboxId}`,
      },
    });
    id = result.site_id;
  }

  try {
    await http.request({
      url: `${NetlifyBaseURL}/${sandboxId}/deploys?siteId=${id}&dist=${
        template.distDir
      }&buildCommand=${buildCommand}`,
      method: 'POST',
      body: file,
      headers: {
        'Content-Type': 'application/zip',
      },
    });

    // sample usage
    // polls every 4s for up to 1m seconds
    // pollUntilDone(
    //   http,
    //   `${NetlifyBaseURL}/${sandboxId}/deploys?siteId=${id}`,
    //   4000,
    //   60 * 1000
    // )
    //   .then(result => {
    //     console.log(result);
    //   })
    //   .catch(err => {
    //     console.log(err);
    //   });

    return path.success();
  } catch (e) {
    return path.error();
  }
}

export async function createApiData({ props, state }) {
  const { contents } = props;
  const sandboxId = state.get('editor.currentId');
  const sandbox = state.get(`editor.sandboxes.${sandboxId}`);
  const template = getTemplate(sandbox.template);
  let apiData = {
    files: [],
  };

  let packageJSON = {};
  let nowJSON = {};
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

  const nowDefaults = {
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
    if (filePath === 'package.json') {
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

  return { apiData };
}

export async function aliasDeployment({ http, path, props, state }) {
  const { nowData, id } = props;
  const token = state.get('user.integrations.zeit.token');
  try {
    const alias = await http.request({
      url: `https://api.zeit.co/v2/now/deployments/${id}/aliases`,
      body: { alias: nowData.alias },
      method: 'POST',
      headers: { Authorization: `bearer ${token}` },
    });
    const url = `https://${alias.result.alias}`;

    return path.success({ message: `Deployment aliased to ${url}` });
  } catch (error) {
    console.error(error);
    return path.error({ error });
  }
}

export async function postToZeit({ http, path, props, state }) {
  const { apiData } = props;
  const token = state.get('user.integrations.zeit.token');
  const deploymentVersion = apiData.version === 2 ? 'v6' : 'v3';

  try {
    const deployment = await http.request({
      url: `https://api.zeit.co/${deploymentVersion}/now/deployments?forceNew=1`,
      body: apiData,
      method: 'POST',
      headers: { Authorization: `bearer ${token}` },
    });

    const url = `https://${deployment.result.url}`;

    return path.success({ url });
  } catch (error) {
    console.error(error);
    return path.error({ error });
  }
}

export function getDeploymentData({ state }) {
  const sandbox = state.get('editor.currentSandbox');
  const nowData =
    sandbox.modules
      .filter(
        m => m.title === 'now.json' || (m.title === 'package.json' && m.now)
      )
      .map(c => JSON.parse(c.code))[0] || {};

  if (!nowData.name) {
    nowData.name = `csb-${sandbox.id}`;
  }

  state.set('deployment.hasAlias', !!nowData.alias);

  return { nowData };
}

async function deploysByID(id, token, http) {
  try {
    const data = await http.request({
      url: `https://api.zeit.co/v3/now/deployments/${id}/aliases`,
      method: 'GET',
      headers: { Authorization: `bearer ${token}` },
    });

    return data.result;
  } catch (e) {
    console.error(e);
    return null;
  }
}

export async function getDeploys({ http, path, state, props }) {
  const token = state.get('user.integrations.zeit.token');
  const { nowData } = props;

  try {
    const data = await http.request({
      url: 'https://api.zeit.co/v3/now/deployments',
      method: 'GET',
      headers: { Authorization: `bearer ${token}` },
    });
    const deploys = data.result.deployments;

    const deploysNoAlias = deploys
      .filter(d => d.name === nowData.name)
      .sort((a, b) => (a.created < b.created ? 1 : -1));

    const assignAlias = async d => {
      const alias = await deploysByID(d.uid, token, http);
      // eslint-disable-next-line
      d.alias = alias.aliases;
      return d;
    };

    const sandboxAlias = await deploysNoAlias.map(assignAlias);

    const sandboxDeploys = await Promise.all(sandboxAlias);

    return path.success({ sandboxDeploys });
  } catch (error) {
    console.error(error);
    return path.error();
  }
}

export async function deleteDeployment({ http, path, state }) {
  const id = state.get('deployment.deployToDelete');
  const token = state.get('user.integrations.zeit.token');

  try {
    await http.request({
      url: `https://api.zeit.co/v2/now/deployments/${id}`,
      method: 'DELETE',
      headers: { Authorization: `bearer ${token}` },
    });

    return path.success();
  } catch (error) {
    console.error(error);
    return path.error();
  }
}
