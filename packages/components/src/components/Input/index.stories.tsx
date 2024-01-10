import React from 'react';
import { action } from '@storybook/addon-actions';
import { Input } from '.';

export default {
  title: 'components/Input',
  component: Input,
};

// replace the text inside with Text variants when available
export const Placeholder = () => <Input placeholder="Your name" marginX={4} />;
export const onChange = () => (
  <Input placeholder="John Doe" onChange={action('input change')} />
);

export const Variants = () => (
  <>
    <Input placeholder="Empty" marginBottom={2} />
    <Input value="Filled" marginBottom={2} />
    <Input value="Focused" autoFocus marginBottom={2} />
    <Input value="Disabled" disabled marginBottom={2} />
  </>
);
