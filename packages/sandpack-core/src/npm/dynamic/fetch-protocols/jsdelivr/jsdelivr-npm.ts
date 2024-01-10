import {
  FetchProtocol,
  Meta,
  downloadDependency,
} from '../../fetch-npm-module';
import { fetchWithRetries } from '../utils';
import { JSDelivrMeta, normalizeJSDelivr } from './utils';

export class JSDelivrNPMFetcher implements FetchProtocol {
  async file(name: string, version: string, path: string): Promise<string> {
    const url = `https://cdn.jsdelivr.net/npm/${name}@${version}${path}`;
    const result = await fetchWithRetries(url).then(x => x.text());

    return result;
  }

  async meta(name: string, version: string): Promise<Meta> {
    // if it's a tag it won't work, so we fetch latest version otherwise
    const latestVersion = /^\d/.test(version)
      ? version
      : JSON.parse(
          (await downloadDependency(name, version, '/package.json')).code
        ).version;

    const url = `https://data.jsdelivr.com/v1/package/npm/${name}@${latestVersion}/flat`;
    const result: JSDelivrMeta = await fetchWithRetries(url).then(x =>
      x.json()
    );

    return normalizeJSDelivr(result.files, {});
  }
}
