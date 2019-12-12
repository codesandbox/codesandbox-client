import { Sandbox, Template } from '@codesandbox/common/lib/types';
import TemplateClass from '@codesandbox/common/lib/templates/template';

// TODO: change all calls to this to not use sandbox anymore
export const templateColor = (
  sandbox: Sandbox,
  templateDef: Template | TemplateClass
) => {
  if (templateDef) {
    return templateDef.color;
  }
  return undefined;
};
