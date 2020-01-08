import React from 'react';
import { action } from '@storybook/addon-actions';
import { Select } from '.';
import { Element } from '../Element';

export default {
  title: 'components/Select',
  component: Select,
};

export const Basic = () => (
  <Element style={{ width: 250 }}>
    <Select>
      <option>One</option>
      <option>Two</option>
    </Select>
  </Element>
);
export const Placeholder = () => (
  <Element style={{ width: 250 }}>
    <Select placeholder="Please select an option">
      <option>One</option>
      <option>Two</option>
    </Select>
  </Element>
);
export const Label = () => (
  <Element style={{ width: 250 }}>
    <Select label="A select " placeholder="Please select an option">
      <option>One</option>
      <option>Two</option>
    </Select>
  </Element>
);

export const onChange = () => (
  <Element style={{ width: 250 }}>
    <Select
      onChange={action('select')}
      label="A select "
      placeholder="Please select an option"
    >
      <option>One</option>
      <option>Two</option>
    </Select>
  </Element>
);
