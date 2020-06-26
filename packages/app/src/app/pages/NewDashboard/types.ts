import {
  SandboxFragmentDashboardFragment,
  TemplateFragmentDashboardFragment,
  RepoFragmentDashboardFragment,
} from 'app/graphql/types';
import { DELETE_ME_COLLECTION } from 'app/overmind/namespaces/dashboard/state';

export type DashboardBaseFolder = {
  name: string;
  path: string;
  parent: string | null;
};

export type DashboardSandbox = {
  type: 'sandbox';
  sandbox: SandboxFragmentDashboardFragment;
  isHomeTemplate?: false;
};

export type DashboardTemplate = {
  type: 'template';
  template: Omit<TemplateFragmentDashboardFragment, 'sandbox'>;
  sandbox: TemplateFragmentDashboardFragment['sandbox'];
  isHomeTemplate?: boolean;
};

export type DashboardFolder = DELETE_ME_COLLECTION &
  DashboardBaseFolder & {
    type: 'folder';
    sandboxes?: number;
    setCreating?: (value: boolean) => void;
  };

export type DashboardRepo = {
  type: 'repo';
  path?: string;
  lastEdited?: string;
  branch: string;
  name: string;
  owner: string;
  sandboxes: RepoFragmentDashboardFragment[];
};

export type DashboardRepoSandbox = {
  type: 'sandbox';
  sandbox: RepoFragmentDashboardFragment;
};

export type DashboardNewFolder = {
  type: 'new-folder';
  setCreating?: (value: boolean) => void;
};

export type DashboardHeader = {
  type: 'header';
  title: string;
  showMoreLink?: string;
  showMoreLabel?: string;
};

export type DashboardNewSandbox = {
  type: 'new-sandbox';
};

export type DashboardNewRepo = {
  type: 'new-repo';
};

export type DashboardSkeletonRow = {
  type: 'skeleton-row';
};

export type DashboardHeaderLink = {
  type: 'header-link';
  label: string;
  link: string;
};

export type DashboardBlank = {
  type: 'blank';
};

export type DashboardSkeleton = {
  type: 'skeleton';
};

export type DashboardNewMasterBranch = {
  type: 'new-master-branch';
  repo: {
    owner: string;
    name: string;
    branch: string;
  };
};

export type DashboardGridItem =
  | DashboardSandbox
  | DashboardTemplate
  | DashboardFolder
  | DashboardHeader
  | DashboardHeaderLink
  | DashboardNewFolder
  | DashboardNewSandbox
  | DashboardNewRepo
  | DashboardSkeletonRow
  | DashboardNewMasterBranch
  | DashboardBlank
  | DashboardRepo
  | DashboardSkeleton;
