import { countBy } from 'lodash-es';
import getTemplate from '@codesandbox/common/lib/templates';

export default function getMostUsedTemplate(sandboxes) {
  const countedByTemplates = countBy(sandboxes, s => s.source.template);
  const mostUsedTemplateInfo = Object.keys(countedByTemplates).reduce(
    (prev, template) => {
      const count = countedByTemplates[template];
      if (count > prev.count) {
        return {
          count,
          template,
        };
      }

      return prev;
    },
    { count: 0, template: '' }
  );

  if (mostUsedTemplateInfo.count > 0) {
    return getTemplate(mostUsedTemplateInfo.template);
  }

  return null;
}
