import { Sandbox } from '@codesandbox/common/lib/types';
import JSZip from 'jszip';
import { createZip, BLOB_ID } from '../zip/create-zip';

export default async function deploy(sandbox: Sandbox) {
  // We first get the zip file, this is what we essentially need to have deployed.
  // So we convert it to an API request that ZEIT will understand
  const zipFile = await createZip(
    sandbox,
    sandbox.modules,
    sandbox.directories,
    false
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
      let content = await file.async('text'); // eslint-disable-line no-await-in-loop
      let isBinary = false;

      // It's marked as a binary
      if (content.startsWith(BLOB_ID)) {
        isBinary = true;
        content = content.replace(BLOB_ID, '');
      }

      apiData.sandbox.push({
        content,
        isBinary,
        path: filePath,
      });
    }
  }

  return apiData;
}
