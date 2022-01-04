import {
  SandboxFragmentDashboardFragment,
  TemplateFragmentDashboardFragment,
  RepoFragmentDashboardFragment,
  Sandbox,
  Album,
  User,
  Maybe,
  SandboxesBetaQuery,
} from 'app/graphql/types';
import {
  PageTypes as PT,
  DELETE_ME_COLLECTION,
} from 'app/overmind/namespaces/dashboard/types';

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
  autoFork?: boolean;
};

export type DashboardTemplate = {
  type: 'template';
  template: Omit<TemplateFragmentDashboardFragment, 'sandbox'>;
  sandbox: TemplateFragmentDashboardFragment['sandbox'] & {
    prNumber?: number;
    originalGit?: RepoFragmentDashboardFragment['originalGit'];
  };
  noDrag?: boolean;
  autoFork?: boolean;
  /**
   * Whether this column should be hidden if it's on the second row of subsequent templates
   */
  optional?: boolean;
};

export type DashboardFolder = DELETE_ME_COLLECTION &
  DashboardBaseFolder & {
    type: 'folder';
  };

export type DashboardRepo = {
  type: 'repo';
  path?: string;
  lastEdited?: Date;
  branch: string;
  name: string;
  owner: string;
  sandboxes: RepoFragmentDashboardFragment[];
  isScrolling?: boolean;
};

export type DashboardRepoSandbox = {
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

export type DashboardNewSandbox = {
  type: 'new-sandbox';
};

export type DashboardNewRepo = {
  type: 'new-repo';
};

export type DashboardBetaNewRepo = {
  type: 'beta-new-repo';
};

type Unpacked<T> = T extends (infer U)[]
  ? U
  : T extends (...args: any[]) => infer U
  ? U
  : T extends Promise<infer U>
  ? U
  : T;

export type DashboardBetaRepo = {
  type: 'beta-repo';
  sandbox: Unpacked<
    NonNullable<NonNullable<SandboxesBetaQuery>['me']>['betaSandboxes']
  >;
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
export type DashboardBlankRowFill = {
  type: 'blank-row-fill';
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

export type DashboardCommunitySandbox = {
  type: 'community-sandbox';
  noDrag: true;
  autoFork: false;
  sandbox: Pick<
    DashboardSandbox['sandbox'],
    'id' | 'alias' | 'title' | 'description' | 'screenshotUrl' | 'source'
  > & {
    author: Maybe<Pick<User, 'username' | 'avatarUrl'>>;
    liked?: boolean;
  } & Pick<Sandbox, 'forkCount' | 'likeCount'>;
};

export type DashboardAlbum = Pick<Album, 'id' | 'title'> & {
  sandboxes: Array<
    SandboxFragmentDashboardFragment & {
      author: Maybe<Pick<User, 'username' | 'avatarUrl'>>;
    } & Pick<Sandbox, 'forkCount' | 'likeCount'>
  >;
};

export type PageTypes = PT;

export type DashboardGridItem =
  | DashboardSandbox
  | DashboardTemplate
  | DashboardFolder
  | DashboardHeader
  | DashboardHeaderLink
  | DashboardNewFolder
  | DashboardNewSandbox
  | DashboardNewRepo
  | DashboardBetaNewRepo
  | DashboardBetaRepo
  | DashboardSkeletonRow
  | DashboardNewMasterBranch
  | DashboardBlank
  | DashboardRepo
  | DashboardRepoSandbox
  | DashboardBlankRowFill
  | DashboardSkeleton
  | DashboardCommunitySandbox;
