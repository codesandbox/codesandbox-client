export interface IFileSystem {
  isFile: (path: string) => Promise<boolean>;
  isFileSync: (path: string) => boolean;
  readFile: (path: string) => Promise<string>;
  readFileSync: (path: string) => string;
}

export interface IResolverOpts {
  fs: IFileSystem;
}

export interface IResolveOpts {
  filename: string;
  parent: string;
  extensions: Array<string>;
}

export interface IResolverResult {
  filepath: string;
  isDependency: boolean;
  code?: string | null;
}

export class Resolver {
  fs: IFileSystem;

  constructor(opts: IResolverOpts) {
    this.fs = opts.fs;
  }

  resolve(opts: IResolveOpts): Promise<IResolverResult | null | undefined> {
    throw new Error('resolve is not implemented for this resolver');
  }

  resolveSync(opts: IResolveOpts): IResolverResult | null | undefined {
    throw new Error('resolveSync is not implemented for this resolver');
  }

  // Clear the cache
  invalidateAll() {}
}
