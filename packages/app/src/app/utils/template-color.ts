import TemplateClass from '@codesandbox/common/es/templates/template';
import { Sandbox, Template } from '@codesandbox/common/es/types';

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
