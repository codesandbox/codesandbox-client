import React from 'react';
import { text } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react';

import ContributorsBadge from './index.tsx';

storiesOf('ContributorsBadge', module).add('Default', () => (
  <ContributorsBadge username={text('username', 'SaraVieira')} />
));
