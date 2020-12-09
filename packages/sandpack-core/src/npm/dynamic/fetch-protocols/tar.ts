import { FetchProtocol, Meta } from '../fetch-npm-module';
import { TarStore } from './utils/tar-store';

export class TarFetcher implements FetchProtocol {
  private tarStore = new TarStore();

  async file(name: string, version: string, path: string): Promise<string> {
    return this.tarStore.file(name, version, path);
  }

  async meta(name: string, version: string): Promise<Meta> {
    return this.tarStore.meta(name, version);
  }
}
