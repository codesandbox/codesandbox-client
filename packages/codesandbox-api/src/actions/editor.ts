import { Action } from './';

export interface OpenModuleAction extends Action {
  path: string;
  lineNumber?: number;
  column?: number;
}

export function openModule(id: string, lineNumber?: number, column?: number): OpenModuleAction {
  // TODO automatically add type: 'action', maybe do this after conversion to TS
  return {
    type: 'action',
    action: 'editor.open-module',
    path: id,
    lineNumber,
    column,
  };
}
