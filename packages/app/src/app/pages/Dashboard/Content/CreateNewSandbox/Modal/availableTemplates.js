import * as templates from '@codesandbox/common/lib/templates';
import { sortBy } from 'lodash-es';
import ImportTab from './ImportTab';

const usedTemplates = sortBy(
  Object.keys(templates)
    .filter(x => x !== 'default')
    .map(t => templates[t])
    .filter(t => t.showOnHomePage),
  'niceName'
);

const presets = [
  {
    ...templates.react,
    variantName: templates.react.niceName,
    niceName: 'React + TS',
    shortid: 'react-ts',
  },
  {
    ...templates.parcel,
    variantName: templates.parcel.niceName,
    niceName: 'Vanilla + TS',
    shortid: 'vanilla-ts',
  },
];

export default [
  {
    name: 'Popular Templates',
    types: [
      {
        name: 'Client Templates',
        templates: usedTemplates.filter(t => t.popular && !t.isServer),
      },
      {
        name: 'Server Templates',
        templates: usedTemplates.filter(t => t.popular && t.isServer),
      },
      {
        name: 'Presets',
        templates: presets,
      },
    ],
  },
  {
    name: 'Client Templates',
    templates: usedTemplates.filter(t => !t.isServer),
  },
  {
    name: 'Server Templates',
    templates: usedTemplates.filter(t => t.isServer),
  },
  {
    name: 'Presets',
    templates: presets,
  },
  {
    name: 'Import',
    component: ImportTab,
  },
];
