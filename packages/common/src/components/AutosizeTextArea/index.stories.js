import React from 'react';
import { text } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react';

import AutosizeTextarea from './index.tsx';

storiesOf('AutosizeTextarea', module).add('Primary', () => (
  <AutosizeTextarea value={text('value', 'hello')} />
));
