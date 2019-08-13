import {
  Module,
  Sandbox,
  ModuleError,
  ModuleCorrection,
  Settings,
  ModuleTab,
  DiffTab,
} from '@codesandbox/common/lib/types';

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
  currentModule: Module;
  currentTab?: ModuleTab | DiffTab;
  sandbox: Sandbox;
  isModuleSynced: (shortid: string) => boolean;
  customEditorAPI?: {
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
  isLive?: boolean;
  sendTransforms?: (transform: any) => void;
  receivingCode?: boolean;
  onCodeReceived?: () => void;
  onSelectionChanged?: (d: { selection: any; moduleShortid: string }) => void;
  onModuleStateMismatch?: () => void;
  theme?: any;
};
