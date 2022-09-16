import untar, { UntarredFiles } from 'isomorphic-untar-gzip';
import { Module } from '../../../../types/module';

import { FetchProtocol, Meta } from '../../fetch-npm-module';
import { fetchWithRetries } from '../utils';

type DeserializedFetchedTar = {
  content: string;
};

/**
 * Responsible for fetching, caching and converting tars to a structure that sandpack
 * understands and can use
 */
export class TarStore implements FetchProtocol {
  private fetchedTars: {
    [key: string]: Promise<{ [path: string]: DeserializedFetchedTar }>;
  } = {};

  private generateKey(name: string, version: string) {
    return name + '||' + version;
  }

  private normalizeTar(tarContents: UntarredFiles) {
    const normalized: { [path: string]: DeserializedFetchedTar } = {};
    tarContents.forEach(tar => {
      normalized[tar.name.replace(/^package/, '')] = {
        // TODO(@CompuIves): store buffers rather than strings for binary files
        content: Buffer.from(tar.buffer).toString(),
      };
    });
    return normalized;
  }

  private fetchTar(name: string, version: string, requestInit?: RequestInit) {
    const tarKey = this.generateKey(name, version);

    this.fetchedTars[tarKey] = (async () => {
      const file = await fetchWithRetries(version, 6, requestInit).then(x =>
        x.arrayBuffer()
      );
      const untarredFile = await untar(file);
      const normalizedTar = this.normalizeTar(untarredFile);

      return normalizedTar;
    })();

    return this.fetchedTars[tarKey];
  }

  public async file(
    name: string,
    url: string,
    path: string,
    requestInit?: RequestInit
  ): Promise<string> {
    const tarKey = this.generateKey(name, url);
    const tar = await (this.fetchedTars[tarKey] ||
      this.fetchTar(name, url, requestInit));

    return tar[path].content;
  }

  async meta(
    name: string,
    url: string,
    requestInit?: RequestInit
  ): Promise<Meta> {
    const tarKey = this.generateKey(name, url);
    const tar = await (this.fetchedTars[tarKey] ||
      this.fetchTar(name, url, requestInit));

    const meta: Meta = {};

    Object.keys(tar).forEach(path => {
      meta[path] = true;
    });

    return meta;
  }

  async massFiles(
    name: string,
    url: string,
    requestInit?: RequestInit
  ): Promise<Module[]> {
    const tarKey = this.generateKey(name, url);
    const tar = await (this.fetchedTars[tarKey] ||
      this.fetchTar(name, url, requestInit));

    return Object.keys(tar).map(path => ({
      path,
      code: tar[path].content,
      downloaded: true,
    }));
  }
}
