import React, { HTMLAttributes } from 'react';
import styled from 'styled-components';
import { Stack } from '@codesandbox/components';
import { Label } from './Label';

const StyledInput = styled.input`
  padding: 12px 16px;
  background-color: #2a2a2a;
  font-family: 'Inter', sans-serif;
  font-size: 16px;
  color: #e5e5e5;
  line-height: 24px;
  border: none;

  &:hover {
    box-shadow: 0 0 0 2px #e5e5e51a;
  }

  &:focus {
    outline: 1px solid #ac9cff;
  }
`;

interface InputTextProps extends HTMLAttributes<HTMLInputElement> {
  id: string;
  label: string;
  name: string;
}

export const InputText = ({
  id,
  label,
  name,
  ...restProps
}: InputTextProps) => (
  <Stack gap={2} direction="vertical">
    <Label htmlFor={id}>{label}</Label>
    <StyledInput id={id} name={name} type="text" {...restProps} />
  </Stack>
);
