import { Action } from '../';

export function add(dependencyName: string) {
  return {
    type: 'action',
    action: 'source.dependencies.add',
    dependency: dependencyName,
  };
}
