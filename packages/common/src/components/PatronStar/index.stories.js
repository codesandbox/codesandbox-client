import React from 'react';
import { storiesOf } from '@storybook/react';

import { PatronStar } from './index.tsx';

storiesOf('Star', module).add('Default', () => (
  <PatronStar subscriptionSince={18263791} />
));
