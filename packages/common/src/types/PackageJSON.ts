export type PackageJSON = {
  name: string;
  description: string;
  keywords: string[];
  main: string;
  dependencies: {
    [dep: string]: string;
  };
  devDependencies: {
    [dep: string]: string;
  };
};
