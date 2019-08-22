import React from 'react';
import { storiesOf } from '@storybook/react';
import { text } from '@storybook/addon-knobs';
import Tooltip from '.';

storiesOf('components/Tooltip', module).add('Tooltip', () => (
  <Tooltip content={text('Content', 'one')}>Hover me</Tooltip>
));
