import Manager from '../../../manager';
import { FetchProtocol, Meta } from '../fetch-npm-module';
import { TarStore } from './utils/tar-store';

/**
 * Remove the ./ or / from the start
 */
function normalizePath(path: string) {
  return path.replace(/^\.\//, '').replace(/^\//, '');
}

export class FileFetcher implements FetchProtocol {
  private tarStore = new TarStore();

  constructor(private manager: Manager) {}

  private async getUrlFromFileProtocol(version: string) {
    const tarLocation = normalizePath(version.replace(/^file:/, ''));

    const module = this.manager.transpiledModules['/' + tarLocation];

    if (!module) {
      throw new Error(`Could not find ${version} while resolving dependency`);
    }

    return module.module.code;
  }

  async file(name: string, version: string, path: string): Promise<string> {
    const url = await this.getUrlFromFileProtocol(version);
    return this.tarStore.file(name, url, path);
  }

  async meta(name: string, version: string): Promise<Meta> {
    const url = await this.getUrlFromFileProtocol(version);
    return this.tarStore.meta(name, url);
  }
}
