import { Sandbox } from '.';
import { TemplateType } from '../../templates';

export const sandbox = (config: Partial<Sandbox> = {}): Sandbox => ({
  id: '1234',
  title: 'Test Sandbox',
  description: 'A test sandbox',
  author: {
    username: 'Test User',
    avatar_url: 'https://placekitten.com/g/200/200',
  },
  tags: ['Tag 1', 'Tag 2', 'Tag 3'],
  template: 'create-react-app-typescript',
  screenshot_url: 'https://placekitten.com/g/1200/300',
  view_count: 100,
  fork_count: 100,
  like_count: 100,
  ...config,
});

export const popularSandbox = (config: Partial<Sandbox> = {}): Sandbox =>
  sandbox({
    view_count: 999999999,
    fork_count: 999999999,
    like_count: 999999999,
    ...config,
  });

export const sandboxWithManyTags = (config: Partial<Sandbox> = {}): Sandbox =>
  sandbox({
    tags: [
      'tag1',
      'tag2',
      'tag3',
      'tag4',
      'tag5',
      'tag6',
      'tag7',
      'tag8',
      'tag9',
      'tag10',
      'tag11',
      'tag12',
      'tag13',
      'tag14',
      'tag16',
      'tag17',
      'tag18',
      'tag19',
      'tag20',
      'tag21',
      'tag22',
      'tag23',
      'tag24',
      'tag25',
      'tag26',
      'tag27',
      'tag28',
      'tag29',
      'tag30',
      'tag31',
      'tag32',
      'tag33',
      'tag34',
      'tag35',
      'tag36',
      'tag37',
      'tag38',
      'tag39',
      'tag40',
      'tag41',
      'tag42',
      'tag43',
      'tag44',
      'tag45',
      'tag46',
      'tag47',
      'tag48',
      'tag49',
    ],
  });

export const sandboxWithLongTitle = (config: Partial<Sandbox> = {}): Sandbox =>
  sandbox({
    title:
      'This is a really really really really really really really really really really really really really really long title',
    ...config,
  });

export const sandboxWithLongDescription = (
  config: Partial<Sandbox> = {}
): Sandbox =>
  sandbox({
    description:
      'This is a really really really really really really really really really really really really really really really really really really really really really really really really really really really really really really really really really really really really really really really really really really really really really really really really really really really really really really really really really really really really really really really really really really really really really really really really really really really really really really really really really really really really really really really really really really really really really really really really really really really really really really really really really really really really really really really really really really really really really really really really really really really really really really long description',
    ...config,
  });

export const sandboxWithNullAuthor = (config: Partial<Sandbox> = {}): Sandbox =>
  sandbox({
    author: null,
  });

export const sandboxWithUndefinedAuthor = (
  config: Partial<Sandbox> = {}
): Sandbox =>
  sandbox({
    author: undefined,
  });

export const sandboxWithNullScreenshotUrl = (
  config: Partial<Sandbox> = {}
): Sandbox =>
  sandbox({
    screenshot_url: null,
  });

export const sandboxWithUndefinedScreenshotUrl = (
  config: Partial<Sandbox> = {}
): Sandbox =>
  sandbox({
    screenshot_url: undefined,
  });

export type TemplateOptions = { [K in TemplateType]: K };

export const templates: TemplateType[] = [
  'adonis',
  'create-react-app',
  'vue-cli',
  'preact-cli',
  'svelte',
  'create-react-app-typescript',
  'angular-cli',
  'parcel',
  'cxjs',
  '@dojo/cli-create-app',
  'gatsby',
  'marko',
  'nuxt',
  'next',
  'reason',
  'apollo',
  'sapper',
  'nest',
  'static',
  'styleguidist',
  'gridsome',
  'vuepress',
  'docusaurus',
  'mdx-deck',
  'quasar',
  'unibit',
];

export const templateOptions = templates.reduce<TemplateOptions>(
  (acc, key) => ({
    ...acc,
    [key]: key,
  }),
  {} as TemplateOptions
);
