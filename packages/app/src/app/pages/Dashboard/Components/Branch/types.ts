import {
  BranchWithPrFragment as BranchWithPR,
  BranchFragment as Branch,
} from 'app/graphql/types';

export type BranchProps = {
  branch: Branch | BranchWithPR;
  branchUrl: string;
  isBeingRemoved: boolean;
  selected: boolean;
  onContextMenu: (evt: React.MouseEvent) => void;
  onClick?: (evt: React.MouseEvent) => void;
  showRepo: boolean;
  lastAccessed: string;
};
