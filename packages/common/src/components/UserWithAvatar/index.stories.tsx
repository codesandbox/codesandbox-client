import React from 'react';
import { storiesOf } from '@storybook/react';
import { text, boolean } from '@storybook/addon-knobs';
import { UserWithAvatar } from '.';

const defaults = () => ({
  username: text('Username', 'SaraVieira'),
  avatarUrl: text(
    'avatar url',
    'https://avatars0.githubusercontent.com/u/1051509?s=460&v=4'
  ),
});

storiesOf('components/UserAvatar', module)
  .add('User', () => <UserWithAvatar {...defaults()} />)
  .add('With Name', () => (
    <UserWithAvatar {...defaults()} name={text('name', 'Sara Vieira')} />
  ))
  .add('With Subscription', () => (
    <UserWithAvatar
      {...defaults()}
      subscriptionSince={text('subscriptionSince', new Date().toString())}
    />
  ))
  .add('With hideBadge', () => (
    <UserWithAvatar {...defaults()} hideBadge={boolean('hideBadge', true)} />
  ))
  .add('With useBigName', () => (
    <UserWithAvatar {...defaults()} useBigName={boolean('useBigName', true)} />
  ));
