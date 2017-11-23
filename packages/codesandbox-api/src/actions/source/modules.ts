import { Action } from '../';

export function rename(path: string, title: string) {
  return {
    type: 'action',
    action: 'source.module.rename',
    path,
    title,
  };
}
