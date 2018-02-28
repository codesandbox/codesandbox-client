export interface IFiles {
  [path: string]: {
    code: string;
  };
}

export interface IFileProps {
  files: IFiles;
  entry: string;
  dependencies: {
    [depName: string]: string;
  };
  width?: number | string;
  height?: number | string;
  sandboxUrl: string;
}

export interface ISandpackContext {
  browserFrame: HTMLIFrameElement;
}
