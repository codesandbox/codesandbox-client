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
import * as fixtures from './fixtures';
import { ThemeDecorator } from '../../stories/decorators';

const stories = storiesOf('components/SandboxCard', module)
  .addDecorator(ThemeDecorator)
  .addDecorator(withKnobs);

const authorWithKnobs = (
  group: string,
  author: Sandbox['author'] = null
): Sandbox['author'] => {
  const knobs = {
    username: text('author.username', author && author.username, group),
    avatar_url: text('author.avatar_url', author && author.avatar_url, group),
  };

  if (knobs.username !== null || knobs.avatar_url !== null) {
    return knobs;
  } else {
    return author;
  }
};

const sandboxWithKnobs = (group: string, sandbox: Sandbox): Sandbox => ({
  id: text('id', sandbox.id, group),
  title: text('title', sandbox.title, group),
  author: authorWithKnobs(group, sandbox.author),
  description: text('description', sandbox.description, group),
  screenshot_url: text('screenshot_url', sandbox.screenshot_url, group),
  view_count: number('view_count', sandbox.view_count, {}, group),
  fork_count: number('fork_count', sandbox.fork_count, {}, group),
  like_count: number('like_count', sandbox.like_count, {}, group),
  template: select(
    'template',
    fixtures.templateOptions,
    sandbox.template,
    group
  ),
  tags: array('tags', sandbox.tags, ',', group),
});

const createSandboxStory = ({
  sandbox = fixtures.sandbox(),
  selectSandbox = action('selectSandbox'),
  small,
  noHeight,
  defaultHeight,
  noMargin,
}: Partial<Props>) => () => (
  <SandboxCard
    sandbox={sandboxWithKnobs('sandbox', sandbox)}
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

stories.add(
  'popular',
  createSandboxStory({ sandbox: fixtures.popularSandbox() })
);

stories.add(
  'many tags',
  createSandboxStory({ sandbox: fixtures.sandboxWithManyTags() })
);

stories.add(
  'long title',
  createSandboxStory({ sandbox: fixtures.sandboxWithLongTitle() })
);

stories.add(
  'long description',
  createSandboxStory({
    sandbox: fixtures.sandboxWithLongDescription(),
  })
);

stories.add(
  'null author',
  createSandboxStory({
    sandbox: fixtures.sandboxWithNullAuthor(),
  })
);

stories.add(
  'undefined author',
  createSandboxStory({
    sandbox: fixtures.sandboxWithUndefinedAuthor(),
  })
);

stories.add(
  'null screenshot url',
  createSandboxStory({
    sandbox: fixtures.sandboxWithNullScreenshotUrl(),
  })
);

stories.add(
  'undefined screenshot url',
  createSandboxStory({
    sandbox: fixtures.sandboxWithUndefinedScreenshotUrl(),
  })
);
