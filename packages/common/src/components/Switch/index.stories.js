import React from 'react';
import { boolean } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react';

import Switch from './index.tsx';

storiesOf('Switch', module)
  .add('Default', () => <Switch />)
  .add('Secondary', () => <Switch secondary={boolean('secondary', true)} />)
  .add('Small', () => <Switch small={boolean('small', true)} />)
  .add('offMode', () => <Switch offMode={boolean('offMode', true)} />);
