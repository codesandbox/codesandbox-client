import React from 'react';
import { Textarea } from '.';

export default {
  title: 'components/Textarea',
  component: Textarea,
};

const Wrapper = ({ children }) => <div style={{ width: 400 }}>{children}</div>;

// replace the text inside with Text variants when available
export const Basic = () => (
  <Wrapper>
    <Textarea />
  </Wrapper>
);
export const InvisibleLabel = () => (
  <Wrapper>
    <Textarea invisibleLabel="Fill your name" />
  </Wrapper>
);
export const Placeholder = () => (
  <Wrapper>
    <Textarea placeholder="Your name" />
  </Wrapper>
);
export const Label = () => (
  <Wrapper>
    <Textarea label="Your full name" placeholder="John Doe" />
  </Wrapper>
);

export const MaxLength = () => (
  <Wrapper>
    <Textarea maxLength={10} label="Your full name" placeholder="John Doe" />
  </Wrapper>
);
