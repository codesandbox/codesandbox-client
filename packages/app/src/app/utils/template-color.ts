import { decorateSelector } from '@codesandbox/common/lib/theme';
import { Sandbox, Template } from '@codesandbox/common/lib/types';

export const templateColor = (sandbox: Sandbox, templateDef: Template) => {
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
