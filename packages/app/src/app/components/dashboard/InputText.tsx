import React, { InputHTMLAttributes } from 'react';
import styled from 'styled-components';
import { Stack } from '@codesandbox/components';
import { Label } from './Label';

const StyledInput = styled.input<{ isInvalid?: boolean }>`
  padding: 12px 16px;
  background-color: #2a2a2a;
  font-family: 'Inter', sans-serif;
  font-size: 16px;
  color: #e5e5e5;
  line-height: 24px;
  border: none;
  border-radius: 2px;

  ${props => (props.isInvalid ? 'outline: 1px solid #EB5E5E;' : '')}

  &:hover {
    box-shadow: 0 0 0 2px #e5e5e51a;
  }

  &:focus {
    outline: 1px solid #ac9cff;
  }
`;

interface InputTextProps extends InputHTMLAttributes<HTMLInputElement> {
  id: string;
  label: string;
  name: string;
  isInvalid?: boolean;
}

export const InputText = ({
  id,
  label,
  name,
  isInvalid,
  ...restProps
}: InputTextProps) => (
  <Stack gap={2} direction="vertical">
    <Label htmlFor={id}>{label}</Label>
    <StyledInput
      id={id}
      name={name}
      type="text"
      isInvalid={isInvalid}
      {...restProps}
    />
  </Stack>
);
