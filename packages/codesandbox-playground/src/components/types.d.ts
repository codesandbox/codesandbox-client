export interface IFileProps {
  files: {
    [path: string]: {
      code: string;
    };
  };
  entry: string;
  dependencies: {
    [dep: string]: string;
  };
  width?: number | string;
  height?: number | string;
  sandboxUrl: string;
}
