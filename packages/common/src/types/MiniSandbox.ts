import { GitInfo } from './Git';
import { SandboxPick } from './SandboxPick';
import { User } from './User';

export type MiniSandbox = {
  viewCount: number;
  title: string;
  template: string;
  id: string;
  picks: SandboxPick[];
  description: string;
  git: GitInfo;
  author: User;
  screenshotUrl: string;
};
