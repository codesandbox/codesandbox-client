import { action } from '@storybook/addon-actions';
import React from 'react';

import { Input } from '.';

export default {
  title: 'components/Input',
  component: Input,
};

// TODO: Replace the text inside with Text variants when available
export const Placeholder = () => <Input placeholder="Your name" marginX={4} />;

export const onChange = () => (
  <Input placeholder="John Doe" onChange={action('input change')} />
);
