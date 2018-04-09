import {
  Sandbox,
  Module,
  SandboxError,
  Correction,
} from 'app/store/modules/editor/types';
import { Settings } from 'app/store/modules/preferences/types';

export type NPMDependencies = {
  [name: string]: string;
};

export interface Editor {
  changeSandbox?: (
    sandbox: Sandbox,
    newCurrentModule: Module,
    dependencies: NPMDependencies
  ) => Promise<any>;
  setErrors?: (errors: SandboxError[]) => any;
  setCorrections?: (corrections: Correction[]) => any;
  setGlyphs?: (glyphs: Array<any>) => any;
  updateModules?: () => any;
  changeSettings?: (settings: Settings) => any;
  changeDependencies?: (deps: NPMDependencies) => any;
  changeModule?: (
    module: Module,
    errors?: SandboxError[],
    corrections?: Correction[]
  ) => any;
  changeCode?: (code: string) => any;
  currentModule?: Module;
  setTSConfig?: (tsConfig: Object) => void;
  setReceivingCode?: (receivingCode: boolean) => void;
  applyOperation?: (operation: any) => void;
  updateUserSelections?: (selections: any) => void;
}
