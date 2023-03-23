import type { TemplateType } from '..';

const SERVER_TEMPLATE_NAMES = [
  'adonis',
  'apollo',
  'docusaurus',
  'ember',
  'gatsby',
  'gridsome',
  'marko',
  'mdx-deck',
  'nest',
  'next',
  'node',
  'nuxt',
  'quasar',
  'remix',
  'sapper',
  'styleguidist',
  'unibit',
  'vuepress',
];

export const isServer = (template: TemplateType) =>
  SERVER_TEMPLATE_NAMES.indexOf(template) !== -1;
