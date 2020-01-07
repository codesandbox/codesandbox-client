import React from 'react';
import styled from 'styled-components';
import css from '@styled-system/css';
import { VisuallyHidden } from 'reakit/VisuallyHidden';
import { uniqueId } from 'lodash-es';

const placeholderStyles = {
  color: 'input.placeholderForeground',
  fontSize: 13,
};

export const InputComponent = styled.input(
  css({
    height: 6,
    paddingX: 2,
    backgroundColor: 'input.background',
    borderBottom: '1px solid',
    borderColor: 'input.border',
    color: 'input.foreground',
    '::-webkit-input-placeholder': placeholderStyles,
    '::-ms-input-placeholder': placeholderStyles,
    '::placeholder': placeholderStyles,
  })
);

const Label = styled.label(
  css({
    fontSize: 11,
    paddingBottom: 2,
    color: 'sidebar.foreground',
    display: 'block',
  })
);

interface IInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  invisibleLabel?: string;
  label?: string;
}

export const Input: React.FC<IInputProps> = ({
  type = 'text',
  invisibleLabel,
  label,
  ...props
}) => {
  const id = props.id || uniqueId('form_');

  return (
    <>
      {invisibleLabel ? (
        <VisuallyHidden>
          <label htmlFor={id}>{invisibleLabel}</label>
        </VisuallyHidden>
      ) : null}
      {label ? <Label htmlFor={id}>{label}</Label> : null}
      <InputComponent id={id} {...props} />
    </>
  );
};
