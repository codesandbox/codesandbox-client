import React from 'react';
import { object } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react';

import Preview from './index.tsx';
import { sandbox } from '../../../.storybook/consts';

storiesOf('Preview', module).add('Default', () => (
  <Preview sandbox={object('Sandbox', sandbox)} settings={{}} />
));
