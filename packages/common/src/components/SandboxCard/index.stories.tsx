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

const knobbedSandbox = (defaults: Sandbox): Sandbox => ({
  id: text('id', defaults.id, 'sandbox'),
  title: text('title', defaults.title, 'sandbox'),
  author: defaults.author && {
    username: text('author.username', defaults.author.username, 'sandbox'),
    avatar_url: text(
      'author.avatar_url',
      defaults.author.avatar_url,
      'sandbox'
    ),
  },
  description: text('description', defaults.description, 'sandbox'),
  screenshot_url: text('screenshot_url', defaults.screenshot_url, 'sandbox'),
  view_count: number('view_count', defaults.view_count, {}, 'sandbox'),
  fork_count: number('fork_count', defaults.fork_count, {}, 'sandbox'),
  like_count: number('like_count', defaults.like_count, {}, 'sandbox'),
  template: select('template', templateOptions, defaults.template, 'sandbox'),
  tags: array('tags', defaults.tags, ',', 'sandbox'),
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
    sandbox={knobbedSandbox(sandbox)}
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
