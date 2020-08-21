import React from 'react';
import { action } from '@storybook/addon-actions';
import { Textarea } from '.';

export default {
  title: 'components/Textarea',
  component: Textarea,
};

const Wrapper = ({ children }) => <div style={{ width: 400 }}>{children}</div>;

export const Placeholder = () => (
  <Wrapper>
    <Textarea placeholder="Your name" />
  </Wrapper>
);

export const MaxLength = () => (
  <Wrapper>
    <Textarea maxLength={10} placeholder="John Doe" />
  </Wrapper>
);

export const onChange = () => (
  <Wrapper>
    <Textarea
      maxLength={10}
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

export const autoResizeWithInitialHeight = () => (
  <Wrapper>
    <Textarea
      autosize
      placeholder="Write a lot of lines here"
      style={{ minHeight: 32 }}
    />
  </Wrapper>
);

export const Controlled = () => {
  const [value, setValue] = React.useState('');
  return (
    <>
      <Wrapper>
        <Textarea
          autosize
          maxLength={20}
          value={value}
          onChange={event => setValue(event.target.value)}
          placeholder="Write a lot of lines here"
        />
      </Wrapper>
      <button type="button" onClick={() => setValue('')}>
        clear value
      </button>
    </>
  );
};

export const DefaultValue = () => (
  <Wrapper>
    <Textarea placeholder="Your name" defaultValue="Default value" />
  </Wrapper>
);
