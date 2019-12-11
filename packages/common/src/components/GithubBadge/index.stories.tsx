import React from 'react';
import { storiesOf } from '@storybook/react';
import GithubBadge from '.';

const stories = storiesOf('components/GithubBadge', module);

stories
  .add('Master', () => (
    <GithubBadge
      username="CompuIves"
      repo="codesandbox-client"
      branch="master"
      commitSha="9823ru9238ru8u998ur2398ru"
    />
  ))
  .add('Other Branch', () => (
    <GithubBadge
      username="CompuIves"
      repo="codesandbox-client"
      branch="storybook"
      commitSha="9823ru9238ru8u998ur2398ru"
    />
  ))
  .add('CommitSha', () => (
    <GithubBadge
      username="CompuIves"
      repo="codesandbox-client"
      branch="9823ru9238ru8u998ur2398ru"
      commitSha="9823ru9238ru8u998ur2398ru"
    />
  ));
