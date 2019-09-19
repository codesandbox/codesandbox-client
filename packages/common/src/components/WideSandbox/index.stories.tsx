import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { text, select, number, array, boolean } from '@storybook/addon-knobs';
import WideSandbox, { Props, Sandbox } from '.';
import * as fixtures from '../SandboxCard/fixtures';

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
  }
  return author;
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
  <WideSandbox
    sandbox={sandboxWithKnobs('sandbox', sandbox)}
    selectSandbox={selectSandbox}
    small={boolean('small', small)}
    noHeight={boolean('noHeight', noHeight)}
    defaultHeight={number('defaultHeight', defaultHeight)}
    noMargin={boolean('noMargin', noMargin)}
  />
);

storiesOf('components/WideSandbox', module)
  .add('basic', createSandboxStory({}))
  .add('small', createSandboxStory({ small: true }))
  .add('no height', createSandboxStory({ noHeight: true }))
  .add('default height', createSandboxStory({ defaultHeight: 500 }))
  .add('no margin', createSandboxStory({ noMargin: true }))
  .add('popular', createSandboxStory({ sandbox: fixtures.popularSandbox() }))
  .add(
    'many tags',
    createSandboxStory({ sandbox: fixtures.sandboxWithManyTags() })
  )
  .add(
    'long title',
    createSandboxStory({ sandbox: fixtures.sandboxWithLongTitle() })
  )
  .add(
    'long description',
    createSandboxStory({
      sandbox: fixtures.sandboxWithLongDescription(),
    })
  )
  .add(
    'null author',
    createSandboxStory({
      sandbox: fixtures.sandboxWithNullAuthor(),
    })
  )
  .add(
    'undefined author',
    createSandboxStory({
      sandbox: fixtures.sandboxWithUndefinedAuthor(),
    })
  )
  .add(
    'null screenshot url',
    createSandboxStory({
      sandbox: fixtures.sandboxWithNullScreenshotUrl(),
    })
  )
  .add(
    'undefined screenshot url',
    createSandboxStory({
      sandbox: fixtures.sandboxWithUndefinedScreenshotUrl(),
    })
  );
