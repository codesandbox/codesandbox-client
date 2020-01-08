import { useId } from '@reach/auto-id';
import VisuallyHidden from '@reach/visually-hidden';
import css from '@styled-system/css';
import React, { FunctionComponent, InputHTMLAttributes } from 'react';
import styled from 'styled-components';

import { Text } from '../Text';

const placeholderStyles = {
  color: 'input.placeholderForeground',
  fontSize: 3,
};

export const InputComponent = styled.input(
  css({
    height: 6,
    paddingX: 2,
    fontSize: 3,
    borderRadius: 'small',
    backgroundColor: 'input.background',
    border: '1px solid',
    borderColor: 'input.border',
    color: 'input.foreground',
    '::-webkit-input-placeholder': placeholderStyles,
    '::-ms-input-placeholder': placeholderStyles,
    '::placeholder': placeholderStyles,
  })
);

type Props = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
};
export const Input: FunctionComponent<Props> = ({
  label,
  placeholder,
  type = 'text',
  ...props
}) => {
  const id = useId(props.id);

  return (
    <>
      {placeholder && !label ? (
        <VisuallyHidden>
          <label htmlFor={id}>{placeholder}</label>
        </VisuallyHidden>
      ) : null}

      <Text
        as="label"
        htmlFor={id}
        marginBottom={2}
        size={2}
        style={{ display: 'block' }}
      >
        {label}
      </Text>

      <InputComponent id={id} {...props} />
    </>
  );
};
