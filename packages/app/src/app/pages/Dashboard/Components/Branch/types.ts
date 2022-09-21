import { GitHubRepository } from 'app/graphql/types';

export type BranchDetails = {
  branchName: string;
  repository: Pick<GitHubRepository, 'owner' | 'name'>;
  BranchIcon: JSX.Element;
  onClick: (e: React.MouseEvent | React.KeyboardEvent) => void;
};
