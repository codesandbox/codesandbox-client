import { Derive } from 'app/overmind';
import { Sandbox } from '@codesandbox/common/lib/types';
import { sortBy } from 'lodash-es';

export type OrderBy = {
  order: 'desc' | 'asc';
  field: string;
};

type State = {
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
};

export const state: State = {
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
  isTemplateSelected: state => templateName => {
    return state.filters.blacklistedTemplates.indexOf(templateName) === -1;
  },
  getFilteredSandboxes: state => sandboxes => {
    const orderField = state.orderBy.field;
    const orderOrder = state.orderBy.order;
    const blacklistedTemplates = state.filters.blacklistedTemplates;

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
      x => blacklistedTemplates.indexOf(x.source.template) === -1
    );

    if (orderOrder === 'desc') {
      orderedSandboxes = orderedSandboxes.reverse();
    }

    return orderedSandboxes;
  },
};
