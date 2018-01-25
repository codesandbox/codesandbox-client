// @flow
import type { Module, Sandbox } from 'common/types';

export type Props = {
  currentModule: Module,
  sandbox: Sandbox,
  onChange: (code: string) => void,
  onInitialized: (editor: any) => void,
  onModuleChange: (moduleId: string) => void,
  onNpmDependencyAdded: (name: string) => void,
  onSave: (code: string) => void,
  settings: {
    autoCompleteEnabled: boolean,
    autoDownloadTypes: boolean,
    codeMirror: boolean,
    fontFamily: string,
    fontSize: number,
    lineHeight: number,
    lineEnabled: boolean,
    vimMode: boolean,
    tabSize: number,
  },
  height: string,
  width: string,
  hideNavigation: ?boolean,
  dependencies: ?{ [name: string]: string },
};
