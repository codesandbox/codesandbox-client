import React from 'react';
import { Input } from '.';

export default {
  title: 'components/Input',
  component: Input,
};

// replace the text inside with Text variants when available
export const Basic = () => <Input />;
export const InvisibleLabel = () => <Input invisibleLabel="Fill your name" />;
export const Placeholder = () => <Input placeholder="Your name" />;
export const Label = () => (
  <Input label="Your full name" placeholder="John Doe" />
);
