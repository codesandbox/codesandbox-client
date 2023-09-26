import { BranchFragment as Branch } from 'app/graphql/types';

export type BranchProps = {
  branch: Branch;
  branchUrl: string;
  isBeingRemoved: boolean;
  selected: boolean;
  onContextMenu: (evt: React.MouseEvent) => void;
  onClick: (evt: React.MouseEvent) => void;
  restricted?: boolean;
  showRepo: boolean;
};
