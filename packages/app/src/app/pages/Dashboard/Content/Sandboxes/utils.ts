import { uniqBy } from 'lodash-es';
import { getSandboxName } from '@codesandbox/common/lib/utils/get-sandbox-name';
import getDefinition from '@codesandbox/common/lib/templates';

export function getPossibleTemplates(sandboxes: any[]) {
  return uniqBy(
    sandboxes.map(x => {
      if (x.forkedTemplate) {
        const sandboxName = getSandboxName(x.forkedTemplate.sandbox);
        return {
          id: x.forkedTemplate.id,
          color: x.forkedTemplate.color,
          name: sandboxName,
          niceName: sandboxName,
        };
      }

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
