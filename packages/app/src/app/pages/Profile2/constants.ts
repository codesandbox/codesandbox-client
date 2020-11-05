export const SANDBOXES_PER_PAGE = 15;
export { ProfileCollection as ProfileCollectionType } from 'app/overmind/namespaces/profile/state';

export enum SandboxType {
  ALL_SANDBOX = 'ALL_SANDBOX',
  PINNED_SANDBOX = 'PINNED_SANDBOX',
  DEFAULT_SANDBOX = 'DEFAULT_SANDBOX',
  PICKER_SANDBOX = 'PICKER_SANDBOX',
  PRIVATE_SANDBOX = 'PRIVATE_SANDBOX',
}

export enum DropTarget {
  SHOWCASED_SANDBOX = 'SHOWCASED_SANDBOX',
  PINNED_SANDBOXES = 'PINNED_SANDBOXES',
}
