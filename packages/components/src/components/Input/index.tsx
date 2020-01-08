import React from 'react';
import styled from 'styled-components';
import css from '@styled-system/css';
import VisuallyHidden from '@reach/visually-hidden';
import { uniqueId } from 'lodash-es';
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
    borderBottom: '1px solid',
    borderColor: 'input.border',
    color: 'input.foreground',
    '::-webkit-input-placeholder': placeholderStyles,
    '::-ms-input-placeholder': placeholderStyles,
    '::placeholder': placeholderStyles,
  })
);

const Label = styled(Text)(
  css({
    marginBottom: 2,
    display: 'block',
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
  const id = props.id || uniqueId('form_');

  return (
    <>
      {props.placeholder && !label ? (
        <VisuallyHidden>
          <label htmlFor={id}>{props.placeholder}</label>
        </VisuallyHidden>
      ) : null}
      <Label size={2} as="label" htmlFor={id}>
        {label}
      </Label>
      <InputComponent id={id} {...props} />
    </>
  );
};
