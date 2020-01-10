import { CustomTemplate } from './CustomTemplate';
import { GitInfo } from './Git';

export type ForkedSandbox = {
  id: string;
  alias: string | null;
  title: string | null;
  customTemplate: CustomTemplate | null;
  insertedAt: string;
  updatedAt: string;
  template: string;
  privacy: 0 | 1 | 2;
  git: GitInfo | null;
};
