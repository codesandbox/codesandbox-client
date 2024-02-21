import {
  SandboxFragmentDashboardFragment as Sandbox,
  RepoFragmentDashboardFragment as Repo,
  TemplateFragmentDashboardFragment as Template,
  TeamFragmentDashboardFragment,
  BranchFragment as Branch,
  ProjectFragment as Repository,
  ProjectWithBranchesFragment as RepositoryWithBranches,
} from 'app/graphql/types';
import isSameWeek from 'date-fns/isSameWeek';
import { sortBy } from 'lodash-es';
import { zonedTimeToUtc } from 'date-fns-tz';
import { derived } from 'overmind';

import { DELETE_ME_COLLECTION, OrderBy } from './types';

export type DashboardSandboxStructure = {
  DRAFTS: Sandbox[] | null;
  TEMPLATES: Template[] | null;
  DELETED: Sandbox[] | null;
  RECENT_SANDBOXES: Sandbox[] | null;
  RECENT_BRANCHES: Branch[] | null;
  SEARCH: Sandbox[] | null;
  TEMPLATE_HOME: Template[] | null;
  SHARED: Sandbox[] | null;
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
};

export type State = {
  sandboxes: DashboardSandboxStructure;
  teams: Array<TeamFragmentDashboardFragment>;
  allCollections: DELETE_ME_COLLECTION[] | null;
  selectedSandboxes: string[];
  trashSandboxIds: string[];
  isDragging: boolean;
  viewMode: 'grid' | 'list';
  orderBy: OrderBy;
  getFilteredSandboxes: (
    sandboxes: Array<Sandbox | Repo | Template['sandbox']>
  ) => Sandbox[];
  deletedSandboxesByTime: {
    week: Sandbox[];
    older: Sandbox[];
  };
  contributions: Branch[] | null;
  /**
   * v2 repositories (formerly projects)
   * stores as a record of team id and repositories (or undefined).
   * implemented this way to overcome an issue where the
   * delayed synced repositories fetch on a previous team
   * overrides the current team data.
   * @see {@link https://linear.app/codesandbox/issue/XTD-375}
   */
  repositoriesByTeamId: Record<string, Repository[] | undefined>;

  /**
   * Repository with branches cached based on `team/owner/repo`
   */
  repositoriesWithBranches: Record<string, RepositoryWithBranches | undefined>;
  starredRepos: Array<{ owner: string; name: string }>;
  /**
   * Use these variables to track if items are being removed. This way
   * we don't have to manipulate the state directly to let the components
   * know what to render.
   */
  removingRepository: { owner: string; name: string } | null;
  removingBranch: { id: string } | null;
  creatingBranch: boolean;
};

export const DEFAULT_DASHBOARD_SANDBOXES: DashboardSandboxStructure = {
  DRAFTS: null,
  TEMPLATES: null,
  DELETED: null,
  SHARED: null,
  RECENT_BRANCHES: null,
  RECENT_SANDBOXES: null,
  SEARCH: null,
  TEMPLATE_HOME: null,
  ALL: null,
  REPOS: null,
};

export const state: State = {
  sandboxes: DEFAULT_DASHBOARD_SANDBOXES,
  viewMode: 'grid',
  allCollections: null,
  teams: [],
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
  getFilteredSandboxes: derived(
    ({ orderBy }: State) => (
      sandboxes: Array<Sandbox | Template['sandbox']>
    ) => {
      const orderField = orderBy.field;
      const orderOrder = orderBy.order;

      const isDateField =
        orderField === 'insertedAt' || orderField === 'updatedAt';

      let orderedSandboxes = sortBy(sandboxes, s => {
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
      }) as Sandbox[];

      if (orderOrder === 'desc') {
        orderedSandboxes = orderedSandboxes.reverse();
      }

      return orderedSandboxes;
    }
  ),
  contributions: null,
  repositoriesByTeamId: {},
  repositoriesWithBranches: {},
  starredRepos: [],
  removingRepository: null,
  removingBranch: null,
  creatingBranch: false,
};
