import getTemplate from 'common/templates';

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
  let apiData = {};
  const filePaths = Object.keys(contents.files);
  for (let i = 0; i < filePaths.length; i += 1) {
    const filePath = filePaths[i];
    const file = contents.files[filePath];

    if (!file.dir) {
      apiData[filePath] = await file.async('text'); // eslint-disable-line no-await-in-loop
    }
  }

  apiData.package = JSON.parse(apiData['package.json']);
  // We force the sandbox id, so ZEIT will always group the deployments to a
  // single sandbox
  apiData.package.name = `csb-${sandbox.id}`;
  delete apiData['package.json'];

  const template = getTemplate(sandbox.template);

  if (template.alterDeploymentData) {
    apiData = template.alterDeploymentData(apiData);
  }

  return { apiData };
}

export function postToZeit({ http, path, props, state }) {
  const { apiData } = props;
  const token = state.get('user.integrations.zeit.token');

  return http
    .request({
      method: 'POST',
      url: 'https://api.zeit.co/now/deployments',
      body: apiData,
      headers: { Authorization: `bearer ${token}` },
    })
    .then(response => {
      const url = `https://${response.result.host}`;
      return path.success({ url });
    })
    .catch(error => path.error({ error }));
}
