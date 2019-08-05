// @flow

import type {
  Module,
  Sandbox,
  ModuleError,
  ModuleCorrection,
} from '@codesandbox/common/lib/types';

export type Settings = {
  autoCompleteEnabled: boolean,
  autoDownloadTypes: boolean,
  codeMirror: boolean,
  fontFamily?: string,
  fontSize: number,
  lineHeight: number,
  lintEnabled: boolean,
  vimMode: boolean,
  tabWidth: number,
  enableLigatures: boolean,
  forceRefresh: boolean,
  experimentVSCode: boolean,
  prettierConfig: Object,
};

type ModuleTab = {
  type: 'MODULE',
  moduleShortid: string,
  dirty: boolean,
};

type DiffTab = {
  type: 'DIFF',
  codeA: string,
  codeB: string,
  titleA: string,
  titleB: string,
  fileTitle?: string,
};

export type Tab = ModuleTab | DiffTab;

export interface Editor {
  changeSandbox?: (
    sandbox: Sandbox,
    newCurrentModule: Module,
    dependencies: Object
  ) => Promise<any>;
  setErrors?: (errors: Array<ModuleError>) => any;
  setCorrections?: (corrections: Array<ModuleCorrection>) => any;
  updateModules?: () => any;
  changeSettings?: (settings: Settings) => any;
  changeDependencies?: (deps: Object) => any;
  changeModule?: (
    module: Module,
    errors?: Array<ModuleError>,
    corrections?: Array<ModuleCorrection>
  ) => any;
  changeCode?: (code: string, moduleId?: string) => any;
  currentModule?: Module;
  sandbox?: Sandbox;
  setTSConfig?: (tsConfig: Object) => void;
  setReceivingCode?: (receivingCode: boolean) => void;
  applyOperations?: (operations: { [moduleShortid: string]: any }) => void;
  updateUserSelections?: (selections: any) => void;
  absoluteWidth?: number;
  absoluteHeight?: number;
}

export type Props = {
  currentModule: Module,
  currentTab: ?Tab,
  sandbox: Sandbox,
  onChange: (code: string, moduleShortid?: string) => void,
  onInitialized: (editor: Editor) => Function,
  onModuleChange: (moduleId: string) => void,
  onNpmDependencyAdded?: (name: string) => void,
  onSave?: (code: string) => void,
  settings: Settings,
  height?: string,
  width?: string,
  hideNavigation?: boolean,
  dependencies?: ?{ [name: string]: string },
  highlightedLines?: Array<number>,
  tsconfig?: Object,
  readOnly?: boolean,
  isLive: boolean,
  sendTransforms?: (transform: any) => void,
  receivingCode?: boolean,
  onCodeReceived?: () => void,
  onSelectionChanged: (d: { selection: any, moduleShortid: string }) => void,
  onModuleStateMismatch?: () => void,
};
