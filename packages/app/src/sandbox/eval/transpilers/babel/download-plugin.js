// @flow
import delay from 'common/utils/delay';
import dependenciesToQuery from '../../../npm/dependencies-to-query';
import type { IBabel } from './babel-worker';

const API_URL =
  'https://f79ogjmj0m.execute-api.eu-west-1.amazonaws.com/dev/package/';

function callApi(query: string) {
  return global.fetch(API_URL + query).then(x => {
    if (!x.ok) {
      throw new Error('Failed to fetch');
    }

    return x.json();
  });
}

const AVAILABLE_RETRIES = 10;
async function getManifest(url: string) {
  let tries = 0;

  while (tries < AVAILABLE_RETRIES) {
    /* eslint-disable no-await-in-loop */
    const res = await global.fetch(url);
    if (!res.ok) {
      tries++;
    } else {
      return res.json();
    }
    await delay(2000);
    /* eslint-enable no-await-in-loop */
  }

  throw new Error('Could not fetch bundle');
}

export default async function downloadPlugins(
  babel: IBabel,
  plugins: Array<string>,
  dependencies: Object
) {
  const pluginMapping = plugins.reduce((total, p) => {
    if (p.startsWith('babel-plugin')) {
      return { ...total, [p]: p };
    }

    return { ...total, [`babel-plugin-${p}`]: p };
  }, {});

  const normalizedPlugins = plugins.map(p => pluginMapping[p]);

  const versions = normalizedPlugins.reduce(
    (object, name) => ({
      ...object,
      [name]: dependencies[name],
    }),
    {}
  );

  const query = dependenciesToQuery(versions);

  const urlInfo:
    | {
        status: 'ok',
        url: string,
        dependencies: Array<string>,
      }
    | { status: 'error', message: string } = await callApi(query);

  if (urlInfo.status !== 'ok') {
    throw new Error(urlInfo.message);
  }

  const manifestUrl = urlInfo.url + '/manifest.json';
  const bundleUrl = urlInfo.url + '/dll.js';
  const manifest = await getManifest(manifestUrl);

  self.importScripts([bundleUrl]);

  plugins.forEach(p => {
    const bundleId = manifest.externals[pluginMapping[p]];
    const id = bundleId.match(/dll_bundle\((.*)\)/)[1];
    const func = global.dll_bundle(id);

    console.log('registering', p, func);
    babel.registerPlugin(p, func.default ? func.default : func);
  });

  return manifest;
}
