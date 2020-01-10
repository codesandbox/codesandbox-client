import React from 'react';
import styled from 'styled-components';
import css from '@styled-system/css';
import VisuallyHidden from '@reach/visually-hidden';
import { useId } from '@reach/auto-id';
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

interface IInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const Input: React.FC<IInputProps> = ({
  type = 'text',
  label,
  ...props
}) => {
  const id = useId(props.id);
  return (
    <>
      {props.placeholder && !label ? (
        <VisuallyHidden>
          <label htmlFor={id}>{props.placeholder}</label>
        </VisuallyHidden>
      ) : null}
      <Text
        as="label"
        size={2}
        marginBottom={2}
        htmlFor={id}
        style={{ display: 'block' }}
      >
        {label}
      </Text>
      <InputComponent id={id} {...props} />
    </>
  );
};
