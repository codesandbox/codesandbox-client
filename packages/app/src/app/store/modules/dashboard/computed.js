import { sortBy } from 'lodash-es';

export function isTemplateSelected(templateName) {
  return this.filters.blacklistedTemplates.indexOf(templateName) === -1;
}

export function getFilteredSandboxes(sandboxes) {
  const orderField = this.orderBy.field;
  const orderOrder = this.orderBy.order;
  const blacklistedTemplates = this.filters.blacklistedTemplates;

  const isDateField = orderField === 'insertedAt' || orderField === 'updatedAt';

  let orderedSandboxes = sortBy(sandboxes, s => {
    if (isDateField) {
      return +new Date(s[orderField]);
    }

    if (orderField === 'title') {
      return s.title || s.id;
    }

    return s[orderField];
  }).filter(x => blacklistedTemplates.indexOf(x.source.template) === -1);

  if (orderOrder === 'desc') {
    orderedSandboxes = orderedSandboxes.reverse();
  }

  return orderedSandboxes;
}
