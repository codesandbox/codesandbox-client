import { action } from '@storybook/addon-actions';
import React, { FunctionComponent } from 'react';

import { Textarea } from '.';

export default {
  title: 'components/Textarea',
  component: Textarea,
};

const Wrapper: FunctionComponent = ({ children }) => (
  <div style={{ width: 400 }}>{children}</div>
);

// TODO: Replace the text inside with Text variants when available
export const Placeholder = () => (
  <Wrapper>
    <Textarea placeholder="Your name" />
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
