import React from 'react';
import { text } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react';

import AutosizeInput from './index.tsx';

storiesOf('AutosizeInput', module).add('Primary', () => (
  <AutosizeInput value={text('value', 'hello')} />
));
