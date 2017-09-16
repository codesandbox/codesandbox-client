import JSZip from 'jszip';

import type { Sandbox, Module, Directory } from 'common/types';

import getTemplate from 'common/templates';

import { createZip } from '../create-zip';

export default async function deploy(
  sandbox: Sandbox,
  modules: Array<Module>,
  directories: Array<Directory>
) {
  // We first get the zip file, this is what we essentially need to have deployed.
  // So we convert it to an API request that ZEIT will understand
  const zipFile = await createZip(sandbox, modules, directories);

  if (!zipFile) {
    return null;
  }

  const contents = await JSZip.loadAsync(zipFile);

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
  apiData.package.name = sandbox.id;
  delete apiData['package.json'];

  const template = getTemplate(sandbox.template);

  if (template.alterDeploymentData) {
    apiData = template.alterDeploymentData(apiData);
  }

  return apiData;
}
