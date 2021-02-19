import { IManagerState, IModuleError, IFiles, IFile } from 'smooshpack';

export type SandpackContext = SandpackState & {
  dispatch: (message: any) => void;
  listen: (listener: SandpackListener) => Function;
};

export interface SandpackState {
  browserFrame: HTMLIFrameElement | null;
  bundlerState: IManagerState | undefined;
  openPaths: string[];
  activePath: string;
  editorState: EditorState;
  error: Partial<IModuleError> | null;
  files: IFiles;
  status: SandpackStatus;
  runSandpack: () => void;
  updateCurrentFile: (newCode: string) => void;
  openFile: (path: string) => void;
  changeActiveFile: (path: string) => void;
}

export type SandpackStatus = 'idle' | 'running';
export type EditorState = 'pristine' | 'dirty';

export type SandpackListener = (msg: any) => void;

export type SandboxTemplate = {
  files: IFiles;
  dependencies: Record<string, string>;
  entry: string;
  main: string;
  environment: SandboxEnviornment;
};

export type SandpackFile = {
  code: string;
  hidden?: boolean;
  active?: boolean;
};

export type SandpackFiles = Record<string, string | SandpackFile>;

export type SandpackSetup = {
  dependencies?: Record<string, string>;
  entry?: string;
  main?: string;
  files?: Record<string, string | IFile>;
  environment?: SandboxEnviornment;
};

export type SandboxEnviornment =
  | 'adonis'
  | 'create-react-app'
  | 'vue-cli'
  | 'preact-cli'
  | 'svelte'
  | 'create-react-app-typescript'
  | 'angular-cli'
  | 'parcel'
  | 'cxjs'
  | '@dojo/cli-create-app'
  | 'gatsby'
  | 'marko'
  | 'nuxt'
  | 'next'
  | 'reason'
  | 'apollo'
  | 'sapper'
  | 'nest'
  | 'static'
  | 'styleguidist'
  | 'gridsome'
  | 'vuepress'
  | 'mdx-deck'
  | 'quasar-framework'
  | 'unibit'
  | 'node'
  | 'ember'
  | 'custom'
  | 'babel-repl';

export type SandpackPredefinedTemplate = 'react' | 'vue' | 'vanilla';
// TODO
// | 'angular-cli'
// | 'parcel';

export type SandpackPredefinedTheme = 'sp-light' | 'sp-dark' | 'night-owl';

export type SandpackTheme = {
  palette: {
    activeText: string;
    defaultText: string;
    inactiveText: string;
    activeBackground: string;
    defaultBackground: string;
    inputBackground: string;
    accent: string;
    errorBackground: string;
    errorForeground: string;
  };
  syntax: {
    plain: string;
    disabled: string;
    keyword: string;
    definition: string;
    punctuation: string;
    property: string;
    tag: string;
    static: string;
  };
  typography: {
    bodyFont: string;
    monoFont: string;
    fontSize: string;
  };
};

export type SandpackPartialTheme = DeepPartial<SandpackTheme>;

export type DeepPartial<Type> = {
  [Property in keyof Type]?: DeepPartial<Type[Property]>;
};

export interface FileResolver {
  isFile: (path: string) => Promise<boolean>;
  readFile: (path: string) => Promise<string>;
}
