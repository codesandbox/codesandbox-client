import { CustomTemplate } from './CustomTemplate';
import { GitInfo } from './Git';

export type SmallSandbox = {
  id: string;
  alias: string;
  title: string;
  description: string;
  privacy: 0 | 1 | 2;
  template: string;
  customTemplate: CustomTemplate | null;
  git: GitInfo | null;
  likeCount: number;
  viewCount: number;
  forkCount: number;
  insertedAt: string;
	updatedAt: string;
};
