// Synced with https://github.com/Noviny/codesandboxer/blob/master/packages/codesandboxer/src/types.js

export type GitInfo = {
  account: string;
  repository: string;
  branch?: string;
  host: 'bitbucket' | 'github';
};

export type Files = {
  [key: string]: {
    content: string;
  };
};

export type ParsedFile = {
  file: string;
  deps: { [key: string]: string };
  internalImports: Array<string>;
  path: string;
};

export type parsedFileFirst = {
  file: string;
  deps: { [key: string]: string };
  internalImports: Array<string>;
};

export type Package = {
  name: string;
  version: string;
  dependencies: {
    [key: string]: string;
  };
  devDependencies: {
    [key: string]: string;
  };
  peerDependencies: {
    [key: string]: string;
  };
};

export type Dependencies = { [key: string]: string };

export type Config = { extensions: string[] };

export type Import = string;

export type ImportReplacement = [string, string];
