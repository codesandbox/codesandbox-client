import { Action } from '..';

export interface ModuleRenameAction extends Action {
  path: string;
  title: string;
}

export interface ModuleSetCode extends Action {
  path: string;
  code: string;
}

export function rename(path: string, title: string): ModuleRenameAction {
  return {
    type: 'action',
    action: 'source.module.rename',
    path,
    title,
  };
}

export function setCode(path: string, code: string): ModuleSetCode {
  return {
    type: 'action',
    action: 'source.module.set-code',
    path,
    code,
  };
}
