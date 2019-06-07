import React from 'react';
import { object } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react';

import WideSandbox from './index.tsx';
import { sandbox } from '../../../.storybook/consts';

storiesOf('WideSandbox', module).add('Default', () => (
  <WideSandbox sandbox={object('Sandbox', sandbox)} settings={{}} />
));
