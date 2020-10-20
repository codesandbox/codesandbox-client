import { satisfies, valid } from 'semver';
import { FetchProtocol, Meta } from '../fetch-npm-module';
import { fetchWithRetries } from './utils';
import { TarStore } from './utils/tar-store';

type PackageVersionInfo = {
  name: string;
  description: string;
  version: string;
  author: string;
  bugs: unknown | null;
  dependencies: unknown | null;
  devDependencies: unknown | null;
  peerDependencies: unknown | null;
  main: string;
  scripts: {
    [script: string]: string;
  };
  dist: {
    integrity: string;
    shasum: string;
    tarball: string;
  };
};

type PackageRegistryInfo = {
  name: string;
  description: string;
  'dist-tags': {
    [tag: string]: string;
  };
  versions: {
    [version: string]: PackageVersionInfo;
  };
};

const NPM_REGISTRY_ACCEPT_HEADER =
  'application/vnd.npm.install-v1+json; q=1.0, application/json; q=0.8, */*';

function join(a: string, b: string) {
  if (a.endsWith('/')) {
    return a + b;
  }

  return a + '/' + b;
}

export type PrivateRegistryOpts = {
  /**
   * A url that can act as a proxy, the request will be sent to this proxyUrl if set, with the
   * original url appended as `?registryurl=...`. So for example:
   * https://proxy.dev/?registryurl=https://google.com
   *
   * This is often used when CORS headers are not set
   */
  proxyUrl?: string;

  scopeWhitelist?: string[];
};

export class PrivateRegistryFetcher implements FetchProtocol {
  private tarStore = new TarStore();
  private packageMetadata = new Map<string, Promise<PackageRegistryInfo>>();
  /**
   * A url that can act as a proxy, the request will be sent to this proxyUrl if set, with the
   * original url appended as `?registryurl=...`. So for example:
   * https://proxy.dev/?registryurl=https://google.com
   */
  private proxyUrl: string | undefined;
  private scopeWhitelist: string[] | undefined;

  constructor(
    private registryLocation: string,
    private authToken: string,
    config: PrivateRegistryOpts
  ) {
    this.proxyUrl = config.proxyUrl;
    this.scopeWhitelist = config.scopeWhitelist;
  }

  private getProxiedUrl(url: string) {
    if (this.proxyUrl) {
      return this.proxyUrl + '?registryurl=' + url;
    }
    return url;
  }

  private getPackageUrl(name: string): string {
    const encodedName = name.replace('/', '%2f');

    return this.getProxiedUrl(join(this.registryLocation, encodedName));
  }

  private getRequestInit(): RequestInit {
    const headers = new Headers();
    headers.append('Accept', NPM_REGISTRY_ACCEPT_HEADER);
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', `Bearer ${this.authToken}`);

    return {
      method: 'get',
      headers,
    };
  }

  private fetchRegistry(url: string): Promise<PackageRegistryInfo> {
    return fetchWithRetries(url, 3, this.getRequestInit()).then(x => {
      if (!x.ok) {
        return Promise.reject(
          new Error('Could not fetch from ' + url + ', ' + x.statusText)
        );
      }

      return x.json();
    });
  }

  private async getPackageMetadata(name: string): Promise<PackageRegistryInfo> {
    if (!this.packageMetadata.has(name)) {
      this.packageMetadata.set(
        name,
        this.fetchRegistry(this.getPackageUrl(name))
      );
    }

    return this.packageMetadata.get(name)!;
  }

  private async getAbsoluteVersion(
    name: string,
    version: string
  ): Promise<string> {
    if (valid(version)) {
      return version;
    }

    const metadata = await this.getPackageMetadata(name);

    if (metadata['dist-tags'][version]) {
      return metadata['dist-tags'][version];
    }

    const versions = Object.keys(metadata.versions).reverse();
    const foundVersion = versions.find(absoluteVersion =>
      satisfies(absoluteVersion, version)
    );
    if (!foundVersion) {
      throw new Error(`Can't find version that satisfies ${name}@${version}`);
    }

    return foundVersion;
  }

  private async getVersionInfo(
    name: string,
    version: string
  ): Promise<PackageVersionInfo> {
    const absoluteVersion = await this.getAbsoluteVersion(name, version);
    const metadata = await this.getPackageMetadata(name);

    const versionInfo = metadata.versions[absoluteVersion];

    if (!versionInfo) {
      throw new Error(
        `Version '${version}' is not available on the registry for '${name}'`
      );
    }

    return versionInfo;
  }

  public async file(
    name: string,
    version: string,
    path: string
  ): Promise<string> {
    const versionInfo = await this.getVersionInfo(name, version);

    const tarball = this.getProxiedUrl(versionInfo.dist.tarball);
    return this.tarStore.file(name, tarball, path, this.getRequestInit());
  }

  public async meta(name: string, version: string): Promise<Meta> {
    const versionInfo = await this.getVersionInfo(name, version);

    const tarball = this.getProxiedUrl(versionInfo.dist.tarball);
    return this.tarStore.meta(name, tarball, this.getRequestInit());
  }

  public condition = (name: string, version: string): boolean => {
    if (this.scopeWhitelist) {
      return this.scopeWhitelist.some(scope => name.startsWith(scope));
    }

    return true;
  };
}
