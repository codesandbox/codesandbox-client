import React from 'react';
import { storiesOf } from '@storybook/react';

import Select from './index.tsx';

storiesOf('Select', module)
  .add('Default', () => (
    <Select>
      <option>Deployments</option>
      <option>Now</option>
      <option>Netlify</option>
    </Select>
  ))
  .add('Error', () => (
    <Select error>
      <option>Deployments</option>
      <option>Now</option>
      <option>Netlify</option>
    </Select>
  ));
