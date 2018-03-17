// @flow
import type {
  Module,
  Sandbox,
  ModuleError,
  ModuleCorrection,
} from 'common/types';

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
};

export interface Editor {
  changeSandbox?: (
    sandbox: Sandbox,
    newCurrentModule: Module,
    dependencies: Object
  ) => Promise<any>;
  setErrors?: (errors: Array<ModuleError>) => any;
  setCorrections?: (corrections: Array<ModuleCorrection>) => any;
  setGlyphs?: (glyphs: Array<any>) => any;
  updateModules?: () => any;
  changeSettings?: (settings: Settings) => any;
  changeDependencies?: (deps: Object) => any;
  changeModule?: (
    module: Module,
    errors?: Array<ModuleError>,
    corrections?: Array<ModuleCorrection>
  ) => any;
  changeCode?: (code: string) => any;
  currentModule?: Module;
  setTSConfig?: (tsConfig: Object) => void;
  setReceivingCode?: (receivingCode: boolean) => void;
  applyOperation?: (operation: any) => void;
  updateUserSelections?: (selections: any) => void;
}

export type Props = {
  currentModule: Module,
  sandbox: Sandbox,
  onChange: (code: string) => void,
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
};
