import _debug from '@codesandbox/common/lib/utils/debug';
import { getAbsoluteDependency } from '@codesandbox/common/lib/utils/dependencies';
import { ILambdaResponse } from '../merge-dependency';

import delay from '../../utils/delay';
import dependenciesToQuery from '../dependencies-to-query';

type Dependencies = {
  [dependency: string]: string;
};

const RETRY_COUNT = 60;
const debug = _debug('cs:sandbox:packager');

const VERSION = 2;

// eslint-disable-next-line
const DEV_URLS = {
  packager:
    'https://xi5p9f7czk.execute-api.eu-west-1.amazonaws.com/dev/packages',
  bucket: 'https://dev-packager-packages.codesandbox.io',
};
// eslint-disable-next-line
const PROD_URLS = {
  packager:
    'https://aiwi8rnkp5.execute-api.eu-west-1.amazonaws.com/prod/packages',
  bucket: 'https://prod-packager-packages.codesandbox.io',
};

const URLS = PROD_URLS;
const BUCKET_URL = URLS.bucket;
const PACKAGER_URL = URLS.packager;

function callApi(url: string, method = 'GET') {
  return fetch(url, {
    method,
  })
    .then(async response => {
      if (!response.ok) {
        const error = new Error(response.statusText || '' + response.status);

        const message = await response.json();

        // @ts-ignore
        error.response = message;
        // @ts-ignore
        error.statusCode = response.status;
        throw error;
      }

      return response;
    })
    .then(response => response.json());
}

/**
 * Request the packager, if retries > RETRY_COUNT it will throw if something goes wrong
 * otherwise it will retry again with an incremented retry
 *
 * @param {string} query The dependencies to call
 */
async function requestPackager(url: string, method = 'GET') {
  let retries = 0;

  // eslint-disable-next-line no-constant-condition
  while (true) {
    debug(`Trying to call packager for ${retries} time`);
    try {
      const manifest = await callApi(url, method); // eslint-disable-line no-await-in-loop

      return manifest;
    } catch (e) {
      if (e.response && e.statusCode !== 504) {
        throw new Error(e.response.error);
      }
      // 403 status code means the bundler is still bundling
      if (retries < RETRY_COUNT) {
        retries += 1;
        await delay(1000 * 2); // eslint-disable-line no-await-in-loop
      } else {
        throw e;
      }
    }
  }
}

function dependencyToPackagePath(name: string, version: string) {
  return `v${VERSION}/packages/${name}/${version}.json`;
}

export async function getDependency(
  depName: string,
  depVersion: string
): Promise<ILambdaResponse> {
  let version = depVersion;
  try {
    const { version: absoluteVersion } = await getAbsoluteDependency(
      depName,
      depVersion
    );
    version = absoluteVersion;
  } catch (e) {
    /* Ignore this, not critical */
  }

  const dependencyUrl = dependenciesToQuery({ [depName]: depVersion });
  const bucketDependencyUrl = dependencyToPackagePath(depName, version);
  const fullUrl = `${BUCKET_URL}/${bucketDependencyUrl}`;

  try {
    const bucketManifest = await callApi(fullUrl);
    return bucketManifest;
  } catch (e) {
    // The dep has not been generated yet...
    await requestPackager(`${PACKAGER_URL}/${dependencyUrl}`, 'POST');

    return requestPackager(fullUrl);
  }
}
