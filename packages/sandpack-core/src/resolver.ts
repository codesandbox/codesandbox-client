import Resolver, { ResolverCache } from 'sandpack-resolver';

const CONDITIONAL_KEYS = [
  'browser',
  'development',
  'default',
  'require',
  'import',
];
const MAIN_FIELDS = ['module', 'browser', 'main', 'jsnext:main'];
const ALIAS_FIELDS = ['browser', 'alias'];

export declare type FnIsFile = (filepath: string) => boolean | Promise<boolean>;
export declare type FnIsFileSync = (filepath: string) => boolean;
export declare type FnReadFile = (filepath: string) => Promise<string>;
export declare type FnReadFileSync = (filepath: string) => string;

export interface IResolveOptionsInput {
  filename: string;
  extensions: string[];
  moduleDirectories?: string[];
  resolverCache?: ResolverCache;
  isFile: FnIsFile;
  isFileSync: FnIsFileSync;
  readFile: FnReadFile;
  readFileSync: FnReadFileSync;
}

export const resolveSync = (
  specifier: string,
  options: IResolveOptionsInput
): string => {
  return Resolver.resolveSync(specifier, {
    ...options,
    mainFields: MAIN_FIELDS,
    aliasFields: ALIAS_FIELDS,
    environmentKeys: CONDITIONAL_KEYS,
  });
};

export const resolveAsync = (
  specifier: string,
  options: IResolveOptionsInput
): Promise<string> => {
  return Resolver.resolve(specifier, {
    ...options,
    mainFields: MAIN_FIELDS,
    aliasFields: ALIAS_FIELDS,
    environmentKeys: CONDITIONAL_KEYS,
  });
};

export type { ResolverCache };
