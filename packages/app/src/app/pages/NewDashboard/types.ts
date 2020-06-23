import {
  SandboxFragmentDashboardFragment,
  TemplateFragmentDashboardFragment,
} from 'app/graphql/types';
import { DELETE_ME_COLLECTION } from 'app/overmind/namespaces/dashboard/state';

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

export type DashboardFolder = DELETE_ME_COLLECTION & {
  type: 'folder';
  parent: string | null;
  name: string;
  sandboxes?: number;
  setCreating?: (value: boolean) => void;
};

export type DashboardRepo = DELETE_ME_COLLECTION & {
  branch: string;
  name: string;
  owner: string;
  level: number;
  sandboxes: number;
  type: 'repo';
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

export type DashboardGridItem =
  | DashboardSandbox
  | DashboardTemplate
  | DashboardFolder
  | DashboardHeader
  | DashboardHeaderLink
  | DashboardNewFolder
  | DashboardNewSandbox
  | DashboardSkeletonRow
  | DashboardBlank
  | DashboardRepo
  | DashboardSkeleton;
