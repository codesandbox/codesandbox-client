import { BranchFragmentFragment as Branch } from 'app/graphql/types';

export type BranchProps = {
  branch: Branch;
  onClick: (e: React.MouseEvent | React.KeyboardEvent) => void;
};
