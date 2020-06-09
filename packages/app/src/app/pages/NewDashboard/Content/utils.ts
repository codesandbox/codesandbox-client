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

export const colors = [
  { background: 'rgb(0, 122, 255)', foreground: 'white' },
  { background: 'rgb(52, 199, 89)', foreground: 'black' },
  { background: 'rgb(255, 45, 85)', foreground: 'white' },
  { background: 'rgb(88, 86, 214)', foreground: 'white' },
  { background: 'rgb(255, 149, 0)', foreground: 'black' },
  { background: 'rgb(90, 200, 250)', foreground: 'black' },
  { background: 'rgb(175, 82, 22)', foreground: 'black' },
  { background: 'rgb(255, 200, 250)', foreground: 'black' },
  { background: 'rgb(69, 235, 195)', foreground: 'black' },
  { background: 'rgb(255, 59, 48)', foreground: 'white' },
  { background: 'rgb(212, 69, 235)', foreground: 'white' },
  { background: 'rgb(192, 235, 69)', foreground: 'black' },
];
