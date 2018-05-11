import getTemplate from 'common/templates';
import { omit } from 'lodash/fp';

// We'll omit the homepage-value from package.json as it creates wrong assumptions over the now deployment evironment.
const omitHomepage = omit('homepage');

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
  let apiData = {
    files: [],
  };
  const filePaths = Object.keys(contents.files);

  let packageJSON = {};
  const projectPackage = contents.files['package.json'];

  if (projectPackage) {
    const data = await projectPackage.async('text'); // eslint-disable-line no-await-in-loop

    const parsed = JSON.parse(data);
    packageJSON = parsed;
  }
  packageJSON = omitHomepage(packageJSON);

  // We force the sandbox id, so ZEIT will always group the deployments to a
  // single sandbox
  packageJSON.name = `csb-${sandbox.id}`;

  apiData.name = `csb-${sandbox.id}`;
  apiData.deploymentType = 'NPM';
  apiData.public = true;

  apiData.files.push({
    file: 'package.json',
    data: JSON.stringify(packageJSON, null, 2),
  });

  for (let i = 0; i < filePaths.length; i += 1) {
    const filePath = filePaths[i];
    const file = contents.files[filePath];

    if (!file.dir && filePath !== 'package.json') {
      const data = await file.async('text'); // eslint-disable-line no-await-in-loop

      apiData.files.push({ file: filePath, data });
    }
  }

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
      url: 'https://api.zeit.co/v3/now/deployments',
      body: apiData,
      headers: { Authorization: `bearer ${token}` },
    })
    .then(response => {
      const url = `https://${response.result.url}`;
      return path.success({ url });
    })
    .catch(error => path.error({ error }));
}
