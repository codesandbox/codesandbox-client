import { satisfies, valid } from 'semver';
import { Module } from '../../../types/module';
import { FetchProtocol, Meta } from '../fetch-npm-module';
import { getSandpackSecret } from '../../../sandpack-secret';
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
  'dist-tags'?: {
    [tag: string]: string;
  };
  versions: {
    [version: string]: PackageVersionInfo;
  };
};

type TarbalUrlTransformer = (
  name: string,
  version: string,
  url: string
) => string;

const NPM_REGISTRY_ACCEPT_HEADER =
  'application/vnd.npm.install-v1+json; q=1.0, application/json; q=0.8, */*';

function join(a: string, b: string) {
  if (a.endsWith('/')) {
    return a + b;
  }

  return a + '/' + b;
}

export type NpmRegistryOpts = {
  /**
   * A url that can act as a proxy, the request will be sent to this proxyUrl if set, with the
   * original url appended as `?registryurl=...`. So for example:
   * https://proxy.dev/?registryurl=https://google.com
   *
   * This is often used when CORS headers are not set
   */
  proxyUrl?: string;

  /**
   * Whether we should only activate this registry for these scopes
   */
  scopeWhitelist?: string[];

  authType?: string;
  authToken?: string;

  /**
   * Allows you to overwrite the tarball url if you have a custom location for it.
   */
  provideTarballUrl?: TarbalUrlTransformer;

  proxyEnabled?: boolean;
};

export class NpmRegistryFetcher implements FetchProtocol {
  private tarStore = new TarStore();
  private packageMetadata = new Map<string, Promise<PackageRegistryInfo>>();
  /**
   * A url that can act as a proxy, the request will be sent to this proxyUrl if set, with the
   * original url appended as `?registryurl=...`. So for example:
   * https://proxy.dev/?registryurl=https://google.com
   */
  private proxyUrl: string | undefined;
  private scopeWhitelist: string[] | undefined;
  private authToken: string | undefined;
  private provideTarballUrl?: TarbalUrlTransformer;
  private proxyEnabled?: boolean = false;
  private authType: string;

  constructor(private registryLocation: string, config: NpmRegistryOpts) {
    this.proxyUrl = config.proxyUrl;
    this.scopeWhitelist = config.scopeWhitelist;
    this.authToken = config.authToken;
    this.provideTarballUrl = config.provideTarballUrl;
    this.proxyEnabled = config.proxyEnabled;
    this.authType = config.authType || 'Bearer';
  }

  private getProxiedUrl(url: string) {
    if (this.proxyUrl) {
      return this.proxyUrl + '?registryurl=' + url;
    }
    return url;
  }

  private getTarballUrl(name: string, version: string, tarballUrl: string) {
    if (this.provideTarballUrl) {
      return this.provideTarballUrl(name, version, tarballUrl);
    }

    return this.getProxiedUrl(tarballUrl);
  }

  private getPackageUrl(name: string): string {
    const encodedName = name.replace('/', '%2f');

    return this.getProxiedUrl(join(this.registryLocation, encodedName));
  }

  private getRequestInit(): RequestInit {
    const headers = new Headers();
    headers.append('Accept', NPM_REGISTRY_ACCEPT_HEADER);
    headers.append('Content-Type', 'application/json');

    /**
     * Private packages conditionals:
     * 1. Explicit token: if `authToken` is provide, add it to the header
     * 2. Proxy disabled: then it's a custom registry, so do not anything
     * 3. Proxy is enabled and team-id is provide: it's a private package provided by CSB
     */

    if (this.authToken) {
      // Custom registry url
      headers.append('Authorization', `${this.authType} ${this.authToken}`);
    } else if (getSandpackSecret()) {
      // CSB proxy
      headers.append('Authorization', `Bearer ${getSandpackSecret()}`);
    }

    return {
      method: 'get',
      headers,
      mode: 'cors',
      credentials: this.proxyEnabled ? 'include' : undefined,
    };
  }

  private fetchRegistry(url: string): Promise<PackageRegistryInfo> {
    return fetchWithRetries(url, 3, this.getRequestInit())
      .then(x => x.json())
      .catch(async e => {
        let errorMessage = 'Make sure the right auth token and URL are set';
        if (e.responseObject) {
          const res = await e.responseObject.json();
          if (res.error) {
            errorMessage = res.error;
          } else if (res.errors?.detail) {
            errorMessage = res.errors.detail[0];
          }
        }

        return Promise.reject(
          new Error(`Could not fetch from registry. ${errorMessage}.`)
        );
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

    if (metadata['dist-tags'] && metadata['dist-tags'][version]) {
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

    const tarball = this.getTarballUrl(
      name,
      versionInfo.version,
      versionInfo.dist.tarball
    );
    return this.tarStore.file(name, tarball, path, this.getRequestInit());
  }

  public async meta(name: string, version: string): Promise<Meta> {
    const versionInfo = await this.getVersionInfo(name, version);

    const tarball = this.getTarballUrl(
      name,
      versionInfo.version,
      versionInfo.dist.tarball
    );
    return this.tarStore.meta(name, tarball, this.getRequestInit());
  }

  public async massFiles(name: string, version: string): Promise<Module[]> {
    const versionInfo = await this.getVersionInfo(name, version);

    const tarball = this.getTarballUrl(
      name,
      versionInfo.version,
      versionInfo.dist.tarball
    );
    return this.tarStore.massFiles(name, tarball, this.getRequestInit());
  }

  public condition = (name: string, version: string): boolean => {
    if (this.scopeWhitelist) {
      return this.scopeWhitelist.some(scope => {
        const [scopeName] = name.split('/');
        return scopeName === scope;
      });
    }

    return true;
  };
}
