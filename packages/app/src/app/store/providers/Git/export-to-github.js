import JSZip from 'jszip';
import { createZip } from '../Utils/create-zip';

export default async function deploy(sandbox) {
  // We first get the zip file, this is what we essentially need to have deployed.
  // So we convert it to an API request that ZEIT will understand
  const zipFile = await createZip(
    sandbox,
    sandbox.modules,
    sandbox.directories
  );

  if (!zipFile) {
    return null;
  }

  const contents = await JSZip.loadAsync(zipFile);

  const apiData = { sandbox: [] };
  const filePaths = Object.keys(contents.files);
  for (let i = 0; i < filePaths.length; i += 1) {
    const filePath = filePaths[i];
    const file = contents.files[filePath];

    if (!file.dir) {
      apiData.sandbox.push({
        content: await file.async('text'), // eslint-disable-line no-await-in-loop
        isBinary: false,
        path: filePath,
      });
    }
  }

  return apiData;
}
