import { FetchProtocol, Meta } from '../fetch-npm-module';

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
  version: {
    [version: string]: PackageVersionInfo;
  };
};

export class PrivateRegistryFetcher implements FetchProtocol {
  private packageMetadata = new Map<string, PackageRegistryInfo>();

  constructor(private registryLocation: string, private authToken: string) {}

  file(name: string, version: string, path: string): Promise<string> {
    throw new Error('Method not implemented.');
  }
  meta(name: string, version: string): Promise<Meta> {
    throw new Error('Method not implemented.');
  }
}
