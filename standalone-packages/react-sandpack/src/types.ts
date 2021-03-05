import { IManagerState, IModuleError, IFiles } from 'smooshpack';

export type SandpackContext = SandpackState & {
  dispatch: (message: any) => void;
  listen: (listener: SandpackListener) => Function;
};

export interface SandpackState {
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

  // Element refs
  // Different components inside the SandpackProvider might register certain elements of interest for sandpack
  // eg: the preview iframe - if no iframe is registered, the context needs to register a hidden one to run the bundler
  // eg: lazy anchor - if no component registers this, then the sandpack runs on mount, without lazy mode
  iframeRef: React.RefObject<HTMLIFrameElement>;
  lazyAnchorRef: React.RefObject<HTMLDivElement>;

  // eg: error screen - if no component registers this, the bundler needs to show the custom error screen
  // When the value is boolean, we only care if the components have the responsibility to render the elements,
  // we don't need the actual element reference
  errorScreenRegisteredRef: React.MutableRefObject<boolean>;
  openInCSBRegisteredRef: React.MutableRefObject<boolean>;
  loadingScreenRegisteredRef: React.MutableRefObject<boolean>;
}

export type SandpackStatus = 'initial' | 'idle' | 'running';
export type EditorState = 'pristine' | 'dirty';

export type SandpackListener = (msg: any) => void;

export type SandboxTemplate = {
  files: IFiles;
  dependencies: Record<string, string>;
  entry: string;
  main: string;
  environment: SandboxEnvironment;
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
  files?: SandpackFiles;
  environment?: SandboxEnvironment;
};

export type SandboxEnvironment =
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

export type SandpackPredefinedTheme =
  | 'codesandbox-light'
  | 'codesandbox-dark'
  | 'night-owl'
  | 'aqua-blue'
  | 'monokai-pro';

export type SandpackSyntaxStyle = {
  color?: string;
  fontStyle?: 'normal' | 'italic';
  fontWeight?:
    | 'normal'
    | 'bold'
    | '100'
    | '200'
    | '300'
    | '400'
    | '500'
    | '600'
    | '700'
    | '800'
    | '900';
  textDecoration?: 'underline' | 'line-through';
};

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
    plain: string | SandpackSyntaxStyle;
    comment: string | SandpackSyntaxStyle;
    keyword: string | SandpackSyntaxStyle;
    definition: string | SandpackSyntaxStyle;
    punctuation: string | SandpackSyntaxStyle;
    property: string | SandpackSyntaxStyle;
    tag: string | SandpackSyntaxStyle;
    static: string | SandpackSyntaxStyle;
    string?: string | SandpackSyntaxStyle; // use static as fallback
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
