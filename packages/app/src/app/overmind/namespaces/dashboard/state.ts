import { sortBy } from 'lodash-es';
import isSameWeek from 'date-fns/isSameWeek';
import isSameDay from 'date-fns/isSameDay';
import isSameMonth from 'date-fns/isSameMonth';
import { Derive } from 'app/overmind';
import {
  Team,
  SandboxFragmentDashboardFragment as Sandbox,
  TemplateFragmentDashboardFragment as Template,
  SidebarCollectionDashboardFragment as Collection,
} from 'app/graphql/types';

export type OrderBy = {
  field: string;
  order: 'desc' | 'asc';
};

export type DELETE_ME_COLLECTION = Collection & {
  name: string;
  level: number;
  parent: string;
};

type State = {
  templateSandboxes: Template[] | null;
  startPageSandboxes: {
    recent: Sandbox[] | null;
    templates: Template[] | null;
  };
  sandboxesByPath: {
    [path: string]: Sandbox[];
  } | null;
  teams: Array<{ __typename?: 'Team' } & Pick<Team, 'id' | 'name'>>;
  allCollections: DELETE_ME_COLLECTION[] | null;
  activeTeam: string | null;
  draftSandboxes: Sandbox[] | null;
  deletedSandboxes: Sandbox[] | null;
  recentSandboxes: Sandbox[] | null;
  selectedSandboxes: string[];
  trashSandboxIds: string[];
  isDragging: boolean;
  orderBy: OrderBy;
  filters: {
    blacklistedTemplates: string[];
    search: string;
  };
  isTemplateSelected: Derive<State, (templateName: string) => boolean>;
  getFilteredSandboxes: Derive<State, (sandboxes: Sandbox[]) => Sandbox[]>;
  recentSandboxesByTime: Derive<
    State,
    {
      day: Sandbox[];
      week: Sandbox[];
      month: Sandbox[];
      older: Sandbox[];
    }
  >;
  deletedSandboxesByTime: Derive<
    State,
    {
      week: Sandbox[];
      older: Sandbox[];
    }
  >;
};

export const state: State = {
  sandboxesByPath: null,
  allCollections: null,
  activeTeam: null,
  startPageSandboxes: { recent: null, templates: null },
  teams: [],
  templateSandboxes: null,
  draftSandboxes: null,
  recentSandboxes: null,
  recentSandboxesByTime: ({ recentSandboxes }) => {
    if (!recentSandboxes)
      return {
        day: [],
        week: [],
        month: [],
        older: [],
      };
    const noTemplateSandboxes = recentSandboxes.filter(s => !s.customTemplate);
    const timeSandboxes = noTemplateSandboxes.reduce(
      (accumulator, currentValue: any) => {
        if (isSameDay(new Date(currentValue.updatedAt), new Date())) {
          accumulator.day.push(currentValue);

          return accumulator;
        }
        if (isSameWeek(new Date(currentValue.updatedAt), new Date())) {
          accumulator.week.push(currentValue);

          return accumulator;
        }
        if (isSameMonth(new Date(currentValue.updatedAt), new Date())) {
          accumulator.month.push(currentValue);

          return accumulator;
        }

        accumulator.older.push(currentValue);

        return accumulator;
      },
      {
        day: [],
        week: [],
        month: [],
        older: [],
      }
    );

    return timeSandboxes;
  },
  deletedSandboxes: null,
  deletedSandboxesByTime: ({ deletedSandboxes }) => {
    if (!deletedSandboxes)
      return {
        week: [],
        older: [],
      };
    const noTemplateSandboxes = deletedSandboxes.filter(s => !s.customTemplate);
    const timeSandboxes = noTemplateSandboxes.reduce(
      (accumulator, currentValue) => {
        if (isSameWeek(new Date(currentValue.removedAt), new Date())) {
          accumulator.week.push(currentValue);

          return accumulator;
        }

        accumulator.older.push(currentValue);

        return accumulator;
      },
      {
        week: [],
        older: [],
      }
    );

    return timeSandboxes;
  },
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
  isTemplateSelected: ({ filters }) => templateName =>
    !filters.blacklistedTemplates.includes(templateName),
  getFilteredSandboxes: ({ orderBy, filters }) => sandboxes => {
    const orderField = orderBy.field;
    const orderOrder = orderBy.order;
    const { blacklistedTemplates } = filters;

    const isDateField =
      orderField === 'insertedAt' || orderField === 'updatedAt';

    let orderedSandboxes = (sortBy(sandboxes, s => {
      if (isDateField) {
        return +new Date(s[orderField]);
      }

      if (orderField === 'title') {
        return s.title || s.id;
      }

      return s[orderField];
    }) as Sandbox[]).filter(
      x => x.source && blacklistedTemplates.indexOf(x.source.template) === -1
    );

    if (orderOrder === 'desc') {
      orderedSandboxes = orderedSandboxes.reverse();
    }

    return orderedSandboxes;
  },
};
