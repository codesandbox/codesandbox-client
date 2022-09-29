import {
  SandboxFragmentDashboardFragment as Sandbox,
  RepoFragmentDashboardFragment as Repo,
  TemplateFragmentDashboardFragment as Template,
  NpmRegistryFragment,
  TeamFragmentDashboardFragment,
  BranchFragment as Branch,
  ProjectFragment as Repository,
} from 'app/graphql/types';
import { DashboardAlbum } from 'app/pages/Dashboard/types';
import isSameWeek from 'date-fns/isSameWeek';
import { sortBy } from 'lodash-es';
import { zonedTimeToUtc } from 'date-fns-tz';
import { derived } from 'overmind';

import { DELETE_ME_COLLECTION, OrderBy } from './types';

export type RecentSandbox = Sandbox & { lastAccessedAt: string };

export type DashboardSandboxStructure = {
  DRAFTS: Sandbox[] | null;
  TEMPLATES: Template[] | null;
  DELETED: Sandbox[] | null;
  RECENT_SANDBOXES: RecentSandbox[] | null;
  RECENT_BRANCHES: Branch[] | null;
  SEARCH: Sandbox[] | null;
  TEMPLATE_HOME: Template[] | null;
  SHARED: Sandbox[] | null;
  LIKED: Sandbox[] | null;
  ALL: {
    [path: string]: Sandbox[];
  } | null;
  REPOS: {
    [path: string]: {
      branch: string;
      name: string;
      owner: string;
      lastEdited: Date;
      sandboxes: Repo[];
    };
  } | null;
  ALWAYS_ON: Sandbox[] | null;
};

export type State = {
  sandboxes: DashboardSandboxStructure;
  teams: Array<TeamFragmentDashboardFragment>;
  workspaceSettings: {
    npmRegistry: NpmRegistryFragment | null;
  };
  allCollections: DELETE_ME_COLLECTION[] | null;
  selectedSandboxes: string[];
  trashSandboxIds: string[];
  isDragging: boolean;
  viewMode: 'grid' | 'list';
  orderBy: OrderBy;
  filters: {
    blacklistedTemplates: string[];
    search: string;
  };
  isTemplateSelected: (templateName: string) => boolean;
  getFilteredSandboxes: (
    sandboxes: Array<Sandbox | Repo | Template['sandbox']>
  ) => Sandbox[];
  deletedSandboxesByTime: {
    week: Sandbox[];
    older: Sandbox[];
  };
  curatedAlbums: DashboardAlbum[];
  contributions: Branch[] | null;
  /** v2 repositories (formerly projects) */
  repositories: Repository[] | null;
};

export const DEFAULT_DASHBOARD_SANDBOXES: DashboardSandboxStructure = {
  DRAFTS: null,
  TEMPLATES: null,
  DELETED: null,
  SHARED: null,
  LIKED: null,
  RECENT_BRANCHES: null,
  RECENT_SANDBOXES: null,
  SEARCH: null,
  TEMPLATE_HOME: null,
  ALL: null,
  REPOS: null,
  ALWAYS_ON: null,
};

export const state: State = {
  sandboxes: DEFAULT_DASHBOARD_SANDBOXES,
  viewMode: 'grid',
  allCollections: null,
  teams: [],
  workspaceSettings: {
    npmRegistry: null,
  },
  curatedAlbums: [],
  deletedSandboxesByTime: derived(({ sandboxes }: State) => {
    const deletedSandboxes = sandboxes.DELETED;
    if (!deletedSandboxes)
      return {
        week: [],
        older: [],
      };
    const noTemplateSandboxes = deletedSandboxes.filter(s => !s.customTemplate);
    const timeSandboxes = noTemplateSandboxes.reduce(
      (accumulator, currentValue) => {
        if (!currentValue.removedAt) return accumulator;
        if (isSameWeek(new Date(currentValue.removedAt), new Date())) {
          // these errors make no sense
          // @ts-ignore
          accumulator.week.push(currentValue);

          return accumulator;
        }
        // @ts-ignore
        accumulator.older.push(currentValue);

        return accumulator;
      },
      {
        week: [],
        older: [],
      }
    );

    return timeSandboxes;
  }),
  selectedSandboxes: [],
  trashSandboxIds: [],
  isDragging: false,
  orderBy: {
    order: 'desc',
    field: 'updatedAt',
  },
  filters: {
    blacklistedTemplates: [],
    search: '',
  },
  isTemplateSelected: derived(({ filters }: State) => (templateName: string) =>
    !filters.blacklistedTemplates.includes(templateName)
  ),
  getFilteredSandboxes: derived(
    ({ orderBy, filters }: State) => (
      sandboxes: Array<Sandbox | Template['sandbox']>
    ) => {
      const orderField = orderBy.field;
      const orderOrder = orderBy.order;
      const { blacklistedTemplates } = filters;

      const isDateField =
        orderField === 'insertedAt' || orderField === 'updatedAt';

      let orderedSandboxes = (sortBy(sandboxes, s => {
        const sandbox = s!;
        if (isDateField) {
          return +zonedTimeToUtc(sandbox[orderField], 'Etc/UTC');
        }

        if (orderField === 'title') {
          const field = sandbox.title || sandbox.alias || sandbox.id;
          return field.toLowerCase();
        }

        if (orderField === 'views') {
          return sandbox.viewCount;
        }

        return sandbox[orderField];
      }) as Sandbox[]).filter(
        x =>
          x.source &&
          x.source.template &&
          blacklistedTemplates.indexOf(x.source.template) === -1
      );

      if (orderOrder === 'desc') {
        orderedSandboxes = orderedSandboxes.reverse();
      }

      return orderedSandboxes;
    }
  ),
  contributions: null,
  repositories: null,
};
