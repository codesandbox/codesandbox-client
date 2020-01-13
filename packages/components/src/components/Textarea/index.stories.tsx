import React from 'react';
import { action } from '@storybook/addon-actions';
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

export const onChange = () => (
  <Wrapper>
    <Textarea
      maxLength={10}
      label="Your full name"
      placeholder="John Doe"
      onChange={action('textarea change')}
    />
  </Wrapper>
);

export const autoResize = () => (
  <Wrapper>
    <Textarea autosize placeholder="Write a lot of lines here" />
  </Wrapper>
);
