import {
  SandboxFragmentDashboardFragment,
  TemplateFragmentDashboardFragment,
  RepoFragmentDashboardFragment,
  BranchFragment as Branch,
  ProjectFragment as Repository,
} from 'app/graphql/types';
import { Context } from 'app/overmind';
import {
  PageTypes as PT,
  DELETE_ME_COLLECTION,
} from 'app/overmind/namespaces/dashboard/types';

export type ViewMode = Context['state']['dashboard']['viewMode'];

export type DashboardBaseFolder = {
  name: string;
  path: string;
  parent: string | null;
};

export type DashboardSandbox = {
  type: 'sandbox';
  sandbox: SandboxFragmentDashboardFragment & {
    prNumber?: number;
    originalGit?: RepoFragmentDashboardFragment['originalGit'];
  };
  noDrag?: boolean;
};

export type DashboardTemplate = {
  type: 'template';
  template: Omit<TemplateFragmentDashboardFragment, 'sandbox'>;
  sandbox: TemplateFragmentDashboardFragment['sandbox'] & {
    prNumber?: number;
    originalGit?: RepoFragmentDashboardFragment['originalGit'];
  };
  noDrag?: boolean;
  /**
   * Whether this column should be hidden if it's on the second row of subsequent templates
   */
  optional?: boolean;
};

export type DashboardFolder = DELETE_ME_COLLECTION &
  DashboardBaseFolder & {
    type: 'folder';
  };

export type DashboardSyncedRepo = {
  type: 'synced-sandbox-repo';
  path?: string;
  lastEdited?: Date;
  branch: string;
  name: string;
  owner: string;
  sandboxes: RepoFragmentDashboardFragment[];
  isScrolling?: boolean;
};

export type DashboardSyncedRepoSandbox = {
  type: 'sandbox';
  sandbox: RepoFragmentDashboardFragment;
};

export type DashboardNewFolder = {
  type: 'new-folder';
  basePath: string;
  setCreating: (value: boolean) => void;
};

export type DashboardHeader = {
  type: 'header';
  title: string;
  showMoreLink?: string;
  showMoreLabel?: string;
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

/**
 * Try to fill the row with blanks until it's filled
 */
type DashboardBlankRowFill = {
  type: 'blank-row-fill';
};

export type DashboardSkeleton = {
  type: 'solid-skeleton';
  viewMode: ViewMode;
};

export type DashboardBranch = {
  type: 'branch';
  branch: Branch;
};

export type DashboardNewBranch = {
  type: 'new-branch';
  repo: {
    owner: string;
    name: string;
  };
  workspaceId?: string;
  disabled?: boolean;
  onClick: () => void;
};

export type DashboardRepository = {
  type: 'repository';
  repository: Repository;
};

export type DashboardImportRepository = {
  type: 'import-repository';
  disabled?: boolean;
  onImportClicked: () => void;
};

export type DashboardFooter = {
  page: PT;
  type: 'footer';
  viewMode: ViewMode;
};

export type PageTypes = PT;

export type DashboardGridItem =
  | DashboardSandbox
  | DashboardTemplate
  | DashboardFolder
  | DashboardHeader
  | DashboardHeaderLink
  | DashboardNewFolder
  | DashboardSkeletonRow
  | DashboardBlank
  | DashboardSyncedRepo
  | DashboardSyncedRepoSandbox
  | DashboardBlankRowFill
  | DashboardSkeleton
  | DashboardBranch
  | DashboardNewBranch
  | DashboardRepository
  | DashboardImportRepository
  | DashboardFooter;
