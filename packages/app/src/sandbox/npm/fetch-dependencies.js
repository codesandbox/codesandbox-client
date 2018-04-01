import { actions, dispatch } from 'codesandbox-api';
import _debug from 'app/utils/debug';

import dependenciesToQuery from './dependencies-to-query';

import delay from '../utils/delay';
import setScreen from '../status-screen';

type Dependencies = {
  [dependency: string]: string,
};

const RETRY_COUNT = 60;
const debug = _debug('cs:sandbox:packager');

const host = process.env.CODESANDBOX_HOST;

const VERSION = 1;

const BUCKET_URL =
  process.env.NODE_ENV === 'production'
    ? 'https://d1jyvh0kxilfa7.cloudfront.net'
    : 'https://s3-eu-west-1.amazonaws.com/dev.packager.packages';
const PACKAGER_URL =
  process.env.NODE_ENV === 'production'
    ? 'https://drq28qbjmc.execute-api.eu-west-1.amazonaws.com/prod/packages'
    : 'https://8o2xeuyo66.execute-api.eu-west-1.amazonaws.com/dev/packages';

function callApi(url: string, method = 'GET') {
  return fetch(url, {
    method,
  })
    .then(async response => {
      if (!response.ok) {
        const error = new Error(response.statusText || response.status);

        const message = await response.json();

        error.response = message;
        error.statusCode = response.status;
        return Promise.reject(error);
      }

      return Promise.resolve(response);
    })
    .then(response => response.json());
}

/**
 * Request the packager, if retries > RETRY_COUNT it will throw if something goes wrong
 * otherwise it will retry again with an incremented retry
 *
 * @param {string} query The dependencies to call
 */
async function requestPackager(url, method = 'GET') {
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

function dependenciesToBucketPath(dependencies: Object) {
  return `v${VERSION}/combinations/${Object.keys(dependencies)
    .sort()
    .map(
      // Paths starting with slashes don't work with cloudfront, even escaped. So we remove the slashes
      dep =>
        `${encodeURIComponent(dep.replace('/', '-').replace('@', ''))}@${
          dependencies[dep]
        }`
    )
    .join('%2B')}.json`;
}

async function getAbsoluteDependencies(dependencies: Object) {
  const nonAbsoluteDependencies = Object.keys(dependencies).filter(dep => {
    const version = dependencies[dep];

    const isAbsolute = /^\d+\.\d+\.\d+$/.test(version);

    return !isAbsolute && !/\//.test(version);
  });

  const newDependencies = { ...dependencies };

  await Promise.all(
    nonAbsoluteDependencies.map(async dep => {
      try {
        const data = await window
          .fetch(
            `${host}/api/v1/dependencies/${dep}@${encodeURIComponent(
              dependencies[dep]
            )}`
          )
          .then(x => x.json())
          .then(x => x.data);

        newDependencies[dep] = data.version;
      } catch (e) {
        /* ignore */
      }
    })
  );

  return newDependencies;
}

async function getDependencies(dependencies: Object) {
  const absoluteDependencies = await getAbsoluteDependencies(dependencies);
  const dependencyUrl = dependenciesToQuery(absoluteDependencies);
  const bucketDependencyUrl = dependenciesToBucketPath(absoluteDependencies);

  setScreen({ type: 'loading', text: 'Downloading Dependencies...' });
  try {
    const bucketManifest = await callApi(
      `${BUCKET_URL}/${bucketDependencyUrl}`
    );
    return bucketManifest;
  } catch (e) {
    setScreen({ type: 'loading', text: 'Resolving Dependencies...' });

    // The dep has not been generated yet...
    const { url } = await requestPackager(
      `${PACKAGER_URL}/${dependencyUrl}`,
      'POST'
    );

    return requestPackager(`${BUCKET_URL}/${url}`);
  }
}

export default async function fetchDependencies(npmDependencies: Dependencies) {
  if (Object.keys(npmDependencies).length !== 0) {
    // New Packager flow

    try {
      const result = await getDependencies(npmDependencies);
      setScreen({ type: 'loading', text: 'Transpiling Modules...' });

      return result;
    } catch (e) {
      e.message = `Could not fetch dependencies: ${e.message}`;
      dispatch(actions.notifications.show(e.message, 'error'));

      throw e;
    }
  }
  return false;
}
