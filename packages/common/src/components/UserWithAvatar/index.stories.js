import React from 'react';
import { storiesOf } from '@storybook/react';

import { UserWithAvatar } from './index.tsx';

const user = {
  view_count: 26337,
  username: 'SaraVieira',
  twitter: 'NikkitaFTW',
  subscription_since: '2018-03-01T16:00:18.032858Z',
  showcased_sandbox_shortid: 'jp64y1jl15',
  name: 'Sara Vieira',
  inserted_at: '2017-07-18T23:49:53.950233',
  id: '8d35d7c1-eecb-4aad-87b0-c22d30d12081',
  curator_at: '2018-11-25T18:51:34.542902Z',
  bio: 'I am sara',
  avatarUrl: 'https://avatars0.githubusercontent.com/u/1051509?v=4',
};

storiesOf('User', module).add('Default', () => <UserWithAvatar {...user} />);
