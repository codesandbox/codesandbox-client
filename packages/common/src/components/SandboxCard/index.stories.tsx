import * as React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import {
  withKnobs,
  text,
  select,
  number,
  array,
  boolean,
} from '@storybook/addon-knobs';
import SandboxCard, { Props, Sandbox } from './';
import * as fake from './fixtures';
import { ThemeDecorator } from '../../stories/decorators';
import { TemplateType } from '../../templates';
import { template } from 'handlebars';

type TemplateOptions = { [K in TemplateType]: K };

const templates: TemplateType[] = [
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
  'mdx-deck',
  'quasar',
  'unibit',
];

const templateOptions = templates.reduce<TemplateOptions>(
  (acc, key) => ({
    ...acc,
    [key]: key,
  }),
  {} as TemplateOptions
);

const stories = storiesOf('components/SandboxCard', module)
  .addDecorator(ThemeDecorator)
  .addDecorator(withKnobs);

const knobbedSandbox = (group: string, sandbox: Sandbox): Sandbox => ({
  id: text('id', sandbox.id, group),
  title: text('title', sandbox.title, group),
  author: sandbox.author && {
    username: text('author.username', sandbox.author.username, group),
    avatar_url: text('author.avatar_url', sandbox.author.avatar_url, group),
  },
  description: text('description', sandbox.description, group),
  screenshot_url: text('screenshot_url', sandbox.screenshot_url, group),
  view_count: number('view_count', sandbox.view_count, {}, group),
  fork_count: number('fork_count', sandbox.fork_count, {}, group),
  like_count: number('like_count', sandbox.like_count, {}, group),
  template: select('template', templateOptions, template, group),
  tags: array('tags', sandbox.tags, ',', group),
});

const createSandboxStory = ({
  sandbox = fake.sandbox(),
  selectSandbox = action('selectSandbox'),
  small,
  noHeight,
  defaultHeight,
  noMargin,
}: Partial<Props>) => () => (
  <SandboxCard
    sandbox={knobbedSandbox('sandbox', sandbox)}
    selectSandbox={selectSandbox}
    small={boolean('small', small)}
    noHeight={boolean('noHeight', noHeight)}
    defaultHeight={number('defaultHeight', defaultHeight)}
    noMargin={boolean('noMargin', noMargin)}
  />
);

stories.add('basic', createSandboxStory({}));

stories.add('small', createSandboxStory({ small: true }));

stories.add('no height', createSandboxStory({ noHeight: true }));

stories.add('default height', createSandboxStory({ defaultHeight: 500 }));

stories.add('no margin', createSandboxStory({ noMargin: true }));

stories.add('popular', createSandboxStory({ sandbox: fake.popularSandbox() }));

stories.add(
  'many tags',
  createSandboxStory({ sandbox: fake.sandboxWithManyTags() })
);

stories.add(
  'long title',
  createSandboxStory({ sandbox: fake.sandboxWithLongTitle() })
);

stories.add(
  'long description',
  createSandboxStory({
    sandbox: fake.sandboxWithLongDescription(),
  })
);

stories.add(
  'null author',
  createSandboxStory({
    sandbox: fake.sandboxWithNullAuthor(),
  })
);

stories.add(
  'undefined author',
  createSandboxStory({
    sandbox: fake.sandboxWithUndefinedAuthor(),
  })
);

stories.add(
  'null screenshot url',
  createSandboxStory({
    sandbox: fake.sandboxWithNullScreenshotUrl(),
  })
);

stories.add(
  'undefined screenshot url',
  createSandboxStory({
    sandbox: fake.sandboxWithUndefinedScreenshotUrl(),
  })
);
