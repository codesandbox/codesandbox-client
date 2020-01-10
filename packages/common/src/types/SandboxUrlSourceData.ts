import { GitInfo } from './Git';

export type SandboxUrlSourceData = {
  id: string;
  alias?: string | null;
  git?: GitInfo;
};
