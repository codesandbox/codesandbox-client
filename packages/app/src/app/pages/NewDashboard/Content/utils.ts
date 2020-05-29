import getDefinition from '@codesandbox/common/es/templates';
import { uniqBy } from 'lodash-es';

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

const colors = [
  'rgb(0, 122, 255)',
  'rgb(52, 199, 89)',
  'rgb(255, 45, 85)',
  'rgb(88, 86, 214)',
  'rgb(255, 149, 0)',
  'rgb(90, 200, 250)',
  'rgb(175, 82, 22)',
  'rgb(255, 200, 250)',
  'rgb(69, 235, 195)',
  'rgb(255, 59, 48)',
  'rgb(212, 69, 235)',
  'rgb(192, 235, 69)',
];
export const randomColor = colors[Math.floor(Math.random() * colors.length)];
