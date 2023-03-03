import _debug from '@codesandbox/common/lib/utils/debug';
import { getAbsoluteDependency } from '@codesandbox/common/lib/utils/dependencies';
import { ILambdaResponse } from '../merge-dependency';

import delay from '../../utils/delay';
import dependenciesToQuery, {
  normalizeVersion,
} from '../dependencies-to-query';

const RETRY_COUNT = 60;
const MAX_RETRY_DELAY = 10_000;
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

        try {
          // @ts-ignore
          error.response = await response.text();
        } catch (err) {
          console.error(err);
        }

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
async function requestPackager(
  url: string,
  method: string = 'GET',
  retries: number = 0
): Promise<any> {
  // eslint-disable-next-line no-constant-condition
  debug(`Trying to call packager for ${retries} time`);

  try {
    const manifest = await callApi(url, method);
    return manifest;
  } catch (err: any) {
    console.error({ err });

    // If it's a 403 or network error, we retry the fetch
    if (err.response && err.statusCode !== 403) {
      throw new Error(err.response.error);
    }

    // 403 status code means the bundler is still bundling
    if (retries < RETRY_COUNT) {
      const msDelay = Math.min(
        MAX_RETRY_DELAY,
        1000 * retries + Math.round(Math.random() * 1000)
      );
      console.warn(`Retrying package fetch in ${msDelay}ms`);
      await delay(msDelay);
      return requestPackager(url, method, retries + 1);
    }

    throw err;
  }
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

  const normalizedVersion = normalizeVersion(version);
  const dependencyUrl = dependenciesToQuery({ [depName]: normalizedVersion });
  const fullUrl = `${BUCKET_URL}/v${VERSION}/packages/${depName}/${normalizedVersion}.json`;

  try {
    const bucketManifest = await callApi(fullUrl);
    return bucketManifest;
  } catch (e) {
    // The dep has not been generated yet...
    const packagerRequestUrl = `${PACKAGER_URL}/${dependencyUrl}`;
    await requestPackager(packagerRequestUrl, 'POST');

    return requestPackager(fullUrl);
  }
}
