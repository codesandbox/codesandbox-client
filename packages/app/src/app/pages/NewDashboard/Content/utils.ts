import { uniqBy } from 'lodash-es';
import getDefinition from '@codesandbox/common/lib/templates';

export function getPossibleTemplates(sandboxes: any[]) {
  if (!sandboxes) return [];
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
