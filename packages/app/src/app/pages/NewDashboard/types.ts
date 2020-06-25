import {
  SandboxFragmentDashboardFragment,
  TemplateFragmentDashboardFragment,
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
    setCreating?: (value: boolean) => void;
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

/**
 * Try to fill the row with blanks until it's filled
 */
export type DashboardBlankRowFill = {
  type: 'blank-row-fill';
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
  | DashboardBlankRowFill
  | DashboardSkeleton;
