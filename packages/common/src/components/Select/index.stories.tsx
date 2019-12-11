import React from 'react';
import { storiesOf } from '@storybook/react';
import Select from '.';

storiesOf('components/Select', module)
  .add('Select', () => (
    <Select>
      <option>one</option>
      <option>two</option>
      <option>three</option>
      <option>four</option>
      <option>five</option>
      <option>six</option>
    </Select>
  ))
  .add('Select error', () => (
    <Select error>
      <option>one</option>
      <option>two</option>
      <option>three</option>
      <option>four</option>
      <option>five</option>
      <option>six</option>
    </Select>
  ));
