import { Module, Sandbox, ModuleError, ModuleCorrection } from '../../types';

export type Settings = {
  autoCompleteEnabled: boolean;
  autoDownloadTypes: boolean;
  codeMirror: boolean;
  clearConsoleEnabled: boolean;
  fontFamily?: string;
  fontSize: number;
  lineHeight: number;
  lintEnabled: boolean;
  vimMode: boolean;
  tabWidth: number;
  enableLigatures: boolean;
  forceRefresh: boolean;
  prettierConfig: Object;
  zenMode: boolean;
};

type ModuleTab = {
  type: 'MODULE';
  moduleShortid: string;
  dirty: boolean;
};

type DiffTab = {
  type: 'DIFF';
  codeA: string;
  codeB: string;
  titleA: string;
  titleB: string;
  fileTitle?: string;
};

export type Tab = ModuleTab | DiffTab;

export interface Editor {
  changeSandbox?: (
    sandbox: Sandbox,
    newCurrentModule: Module,
    dependencies: Object
  ) => Promise<any>;
  setErrors?: (errors: Array<ModuleError>) => any;
  setCorrections?: (corrections: ModuleCorrection[]) => any;
  updateModules?: () => any;
  changeSettings?: (settings: Settings) => any;
  changeDependencies?: (deps: Object) => any;
  changeModule?: (
    module: Module,
    errors?: Array<ModuleError>,
    corrections?: ModuleCorrection[]
  ) => any;
  changeCode?: (code: string, moduleId?: string) => any;
  currentModule?: Module;
  setTSConfig?: (tsConfig: Object) => void;
  setReceivingCode?: (receivingCode: boolean) => void;
  applyOperations?: (operations: { [moduleShortid: string]: any }) => void;
  updateUserSelections?: (selections: any) => void;
  absoluteWidth?: number;
  absoluteHeight?: number;
}

export type Props = {
  currentModule: Module;
  currentTab: Tab | undefined;
  sandbox: Sandbox;
  isModuleSynced: (shortid: string) => boolean;
  customEditorAPI: {
    getCustomEditor: (
      path: string
    ) => (container: HTMLElement, extraProps: object) => void;
  };
  onChange: (code: string, moduleShortid?: string) => void;
  onInitialized: (editor: Editor) => Function;
  onModuleChange: (moduleId: string) => void;
  onNpmDependencyAdded?: (name: string) => void;
  onSave?: (code: string) => void;
  settings: Settings;
  height?: string;
  width?: string;
  hideNavigation?: boolean;
  dependencies?: { [name: string]: string };
  highlightedLines?: Array<number>;
  tsconfig?: Object;
  readOnly?: boolean;
  isLive: boolean;
  sendTransforms?: (transform: any) => void;
  receivingCode?: boolean;
  onCodeReceived?: () => void;
  onSelectionChanged: (d: { selection: any; moduleShortid: string }) => void;
  onModuleStateMismatch?: () => void;
  theme: any;
};
