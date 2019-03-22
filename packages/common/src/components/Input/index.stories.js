import React from 'react';
import { text } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react';

import Input from './index.tsx';

storiesOf('Input', module)
  .add('Primary', () => <Input value={text('value', 'hello')} />)
  .add('Error', () => <Input error value={text('value', 'hello')} />)
  .add('FullWidth', () => <Input fullWidth value={text('value', 'hello')} />);
