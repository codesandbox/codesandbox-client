import React from 'react';
import { storiesOf } from '@storybook/react';

import SandboxCard from './index.tsx';
import { sandbox } from '../../../.storybook/consts';

storiesOf('SandboxCard', module)
  .add('Default', () => <SandboxCard sandbox={sandbox} />)
  .add('small', () => <SandboxCard small sandbox={sandbox} />);
