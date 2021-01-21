import { TemplateType } from '..';

const SERVER_TEMPLATE_NAMES = [
  'adonis',
  'apollo',
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
  'sapper',
  'styleguidist',
  'unibit',
  'vuepress',
  'docusaurus',
];

export const isServer = (template: TemplateType) =>
  SERVER_TEMPLATE_NAMES.indexOf(template) !== -1;
