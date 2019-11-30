import { decorateSelector } from '@codesandbox/common/lib/utils/decorate-selector';
import { Sandbox, Template } from '@codesandbox/common/lib/types';
import TEMPLATE from '@codesandbox/common/lib/templates/template';

export const templateColor = (
  sandbox: Sandbox,
  templateDef: Template | TEMPLATE
) => {
  if (sandbox && sandbox.customTemplate) {
    return decorateSelector(() => sandbox.customTemplate.color);
  }

  if (sandbox && sandbox.forkedTemplate) {
    return decorateSelector(() => sandbox.forkedTemplate.color);
  }

  if (templateDef) {
    return templateDef.color;
  }
  return undefined;
};
