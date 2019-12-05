import * as templates from '@codesandbox/common/lib/templates';
import { sortBy } from 'lodash-es';
import { Template } from '@codesandbox/common/lib/types';

const usedTemplates = sortBy(
  Object.keys(templates)
    .filter(x => x !== 'default')
    .map(t => templates[t])
    .filter(t => t.showOnHomePage),
  'niceName'
);

export const presets = [
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

export const popular = [
  {
    name: 'Client Templates',
    templates: usedTemplates.filter(t => t.popular && !t.isServer),
  },
  {
    name: 'Server Templates',
    templates: usedTemplates.filter(t => t.popular && t.isServer),
  },
  { name: 'Presets', templates: presets },
];

export const client = usedTemplates.filter(t => !t.isServer);
export const container = usedTemplates.filter(t => t.isServer);

export const all: Template[] = [...client, ...presets, ...container];
