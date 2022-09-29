import { BranchFragment as Branch } from 'app/graphql/types';

export type BranchProps = {
  branch: Branch;
  branchUrl: string;
  onContextMenu: (evt: React.MouseEvent) => void;
  onClick: (evt: React.MouseEvent) => void;
  selected: boolean;
};
