import getDefinition from '@codesandbox/common/es/templates';
import { uniqBy } from 'lodash-es';

export function getPossibleTemplates(sandboxes: any[]) {
  return uniqBy(
    sandboxes.map(x => {
      const templateId = x.source?.template;
      const template = getDefinition(templateId);

      return {
        id: templateId,
        color: template.color,
        name: template.name,
        niceName: template.niceName,
      };
    }),
    template => template.id
  );
}
