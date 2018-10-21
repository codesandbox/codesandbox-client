import { omit } from 'lodash-es';

export function createZip({ utils, state }) {
  const sandboxId = state.get('editor.currentId');
  const sandbox = state.get(`editor.sandboxes.${sandboxId}`);
  return utils.getZip(sandbox).then(result => ({ file: result.file }));
}

export function loadZip({ props, jsZip }) {
  const { file } = props;

  return jsZip.loadAsync(file).then(result => ({ contents: result }));
}

export async function createApiData({ props, state }) {
  const { contents } = props;
  const sandboxId = state.get('editor.currentId');
  const sandbox = state.get(`editor.sandboxes.${sandboxId}`);
  const apiData = {
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
    type: 'NPM',
    public: true,
  };

  const filePaths = nowJSON.files || Object.keys(contents.files);

  // We'll omit the homepage-value from package.json as it creates wrong assumptions over the now deployment evironment.
  packageJSON = omit(packageJSON, 'homepage');

  // We force the sandbox id, so ZEIT will always group the deployments to a
  // single sandbox
  packageJSON.name = nowJSON.name || nowDefaults.name;

  apiData.name = nowJSON.name || nowDefaults.name;
  apiData.deploymentType = nowJSON.type || nowDefaults.type;
  apiData.public = nowJSON.public || nowDefaults.public;
  apiData.config = omit(nowJSON, ['public', 'type', 'name', 'files']);
  apiData.forceNew = true;

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
      const data = await file.async('text'); // eslint-disable-line no-await-in-loop

      apiData.files.push({ file: filePath, data });
    }
  }

  return { apiData };
}

// Will be used later to create alias but I wanna get this PR merged first
export async function addAlias({ http, path, props, state }) {
  const { apiData, deploymentId } = props;
  const token = state.get('user.integrations.zeit.token');
  try {
    const alias = await http.request({
      url: `https://api.zeit.co/v2/now/deployments/${deploymentId}/aliases`,
      body: { alias: apiData.config.alias },
      method: 'POST',
      headers: { Authorization: `bearer ${token}` },
    });
    const url = `https://${alias.result.alias}`;
    return path.success({ url });
  } catch (error) {
    console.error(error);
    return path.error({ error });
  }
}

export async function postToZeit({ http, path, props, state }) {
  const { apiData } = props;
  const token = state.get('user.integrations.zeit.token');

  try {
    const deployment = await http.request({
      url: 'https://api.zeit.co/v3/now/deployments',
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
