import React from 'react';
import { array } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react';

import Tags from './index.tsx';

storiesOf('Tags', module).add('Default', () => (
  <Tags tags={array('tags', ['test', 'react-app'], ',')} />
));
