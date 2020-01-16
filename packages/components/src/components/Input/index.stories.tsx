import React from 'react';
import { action } from '@storybook/addon-actions';
import { Input } from '.';

export default {
  title: 'components/Input',
  component: Input,
};

// replace the text inside with Text variants when available
export const Basic = () => <Input />;
export const Placeholder = () => <Input placeholder="Your name" />;
export const Label = () => (
  <Input label="Your full name" placeholder="John Doe" />
);
export const onChange = () => (
  <Input
    label="Your full name"
    placeholder="John Doe"
    onChange={action('input change')}
  />
);
