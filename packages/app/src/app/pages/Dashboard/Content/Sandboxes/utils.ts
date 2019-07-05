import { uniqBy } from 'lodash-es';
import getDefinition from '@codesandbox/common/lib/templates';

export function getPossibleTemplates(sandboxes: any[]) {
  return uniqBy(
    sandboxes.map(x => {
      const template = getDefinition(x.source.template);

      return {
        id: x.source.template,
        color: template.color,
        name: template.name,
        niceName: template.niceName,
      };
    }),
    template => template.id
  );
}
