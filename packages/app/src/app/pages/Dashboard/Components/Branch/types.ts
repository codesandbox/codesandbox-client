import { RepositoryBranch } from 'app/overmind/namespaces/dashboard/types';

export type BranchProps = {
  branch: RepositoryBranch;
  onClick: (e: React.MouseEvent | React.KeyboardEvent) => void;
};
