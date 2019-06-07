import React from 'react';
import { storiesOf } from '@storybook/react';

import Notice from './index.tsx';

storiesOf('Notice', module).add('Default', () => <Notice>Sup</Notice>);
