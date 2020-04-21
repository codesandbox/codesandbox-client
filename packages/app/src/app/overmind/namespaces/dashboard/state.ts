import { Sandbox } from '@codesandbox/common/lib/types';
import { sortBy } from 'lodash-es';
import isSameWeek from 'date-fns/isSameWeek';
import isSameDay from 'date-fns/isSameDay';
import isSameMonth from 'date-fns/isSameMonth';
import { Derive } from 'app/overmind';

export type OrderBy = {
  field: string;
  order: 'desc' | 'asc';
};

type State = {
  loadingPage: boolean;
  templateSandboxes: any[];
  startPageSandboxes: {
    recent: any[];
    templates: any[];
  };
  draftSandboxes: any[];
  deletedSandboxes: any[];
  recentSandboxes: any[];
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
  loadingPage: false,
  startPageSandboxes: { recent: [], templates: [] },
  templateSandboxes: [],
  draftSandboxes: [],
  recentSandboxes: [],
  recentSandboxesByTime: ({ recentSandboxes }) => {
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
  deletedSandboxes: [],
  deletedSandboxesByTime: ({ deletedSandboxes }) => {
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
