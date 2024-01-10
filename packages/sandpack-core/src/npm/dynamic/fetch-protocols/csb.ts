import { FetchProtocol, Meta } from '../fetch-npm-module';
import { TarStore } from './utils/tar-store';

function getTarballUrl(url: string) {
  return url.replace(/\/_pkg.tgz$/, '');
}

export class CsbFetcher implements FetchProtocol {
  private tarStore = new TarStore();

  async file(name: string, version: string, path: string): Promise<string> {
    const url = getTarballUrl(version);
    return this.tarStore.file(name, url, path);
  }

  async meta(name: string, version: string): Promise<Meta> {
    const url = getTarballUrl(version);
    return this.tarStore.meta(name, url);
  }
}
