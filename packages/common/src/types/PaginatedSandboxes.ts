import { SmallSandbox } from './SmallSandbox';

export type PaginatedSandboxes = {
  [page: number]: Array<SmallSandbox>;
};
