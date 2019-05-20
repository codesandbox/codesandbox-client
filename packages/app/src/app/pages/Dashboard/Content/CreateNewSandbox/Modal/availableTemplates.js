import * as templates from '@codesandbox/common/lib/templates';
import { sortBy } from 'lodash-es';

const usedTemplates = sortBy(
  Object.keys(templates)
    .filter(x => x !== 'default')
    .map(t => templates[t])
    .filter(t => t.showOnHomePage),
  'niceName'
);

export const popular = [
  {
    name: 'Client Templates',
    templates: usedTemplates.filter(t => t.popular && !t.isServer),
  },
  {
    name: 'Server Templates',
    templates: usedTemplates.filter(t => t.popular && t.isServer),
  },
];

export const client = usedTemplates.filter(t => !t.isServer);
export const container = usedTemplates.filter(t => t.isServer);

// const presets = [
//   {
//     ...templates.react,
//     variantName: templates.react.niceName,
//     niceName: 'React + TS',
//     shortid: 'react-ts',
//   },
//   {
//     ...templates.parcel,
//     variantName: templates.parcel.niceName,
//     niceName: 'Vanilla + TS',
//     shortid: 'vanilla-ts',
//   },
// ];
