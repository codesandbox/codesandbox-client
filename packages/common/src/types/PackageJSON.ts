export type PackageJSON = {
  name: string;
  version: string;
  description?: string;
  keywords?: string[];
  main?: string;
  scripts?: {
    [command: string]: string;
  };
  dependencies?: {
    [dep: string]: string;
  };
  devDependencies?: {
    [dep: string]: string;
  };
  jest?: {
    setupFilesAfterEnv?: string[];
  };
  resolutions?: { [dependency: string]: string };
};
