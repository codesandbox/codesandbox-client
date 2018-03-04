export interface IFile {
  code: string;
}

export interface IFiles {
  [path: string]: IFile;
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
  sandboxUrl: string;
  openedPath: string;
  files: IFiles;
  openFile: (path: string) => void;
  updateFiles: (files: IFiles) => void;
}
