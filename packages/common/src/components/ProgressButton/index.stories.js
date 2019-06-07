import React from 'react';
import { storiesOf } from '@storybook/react';

import ProgressButton from './index.tsx';

storiesOf('ProgressButton', module)
  .add('Loading', () => <ProgressButton loading />)
  .add('Disabled', () => <ProgressButton disabled />);
