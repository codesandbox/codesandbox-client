import { Action } from '..';

export interface AddDependencyAction extends Action {
  dependency: string;
}

export function add(dependencyName: string): AddDependencyAction {
  return {
    type: 'action',
    action: 'source.dependencies.add',
    dependency: dependencyName,
  };
}
