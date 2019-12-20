import { Sandbox } from '@codesandbox/common/lib/types';
import JSZip from 'jszip';
import zip from '../zip';

const BLOB_ID = 'blob-url://';
export default async function deploy(sandbox: Sandbox) {
  // We first get the zip file, this is what we essentially need to have deployed.
  // So we convert it to an API request that ZEIT will understand
  const zipFile = await zip.create(sandbox);

  if (!zipFile) {
    return null;
  }

  const contents = await JSZip.loadAsync(zipFile);
  const apiData = { sandbox: [] };
  const filePaths = Object.keys(contents);
  for (let i = 0; i < filePaths.length; i += 1) {
    const filePath = filePaths[i];
    const file = contents[filePath];

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
