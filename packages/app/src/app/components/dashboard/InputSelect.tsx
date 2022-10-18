import React, { SelectHTMLAttributes } from 'react';
import styled from 'styled-components';
import { Icon, Stack } from '@codesandbox/components';
import { Label } from './Label';

const RelativeWrapper = styled.div`
  position: relative;
`;

const StyledSelect = styled.select`
  box-sizing: border-box;
  appearance: none;

  width: 100%;
  padding: 12px 40px 12px 16px;
  background-color: #2a2a2a;
  font-family: 'Inter', sans-serif;
  font-size: 16px;
  color: #e5e5e5;
  line-height: 24px;
  border: none;
  border-radius: 2px;

  &:hover {
    box-shadow: 0 0 0 2px #e5e5e51a;
  }

  &:focus {
    outline: 1px solid #ac9cff;
  }
`;

const DropdownIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
  position: absolute;
  right: 0;
  top: 0;
  height: 100%;
  padding-right: 16px;
`;

interface InputSelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  id: string;
  label: string;
  name: string;
  options: Array<{ value: string; label: string }>;
}

export const InputSelect = ({
  id,
  label,
  name,
  options,
  ...restProps
}: InputSelectProps) => {
  return (
    <Stack gap={2} direction="vertical">
      <Label htmlFor={id}>{label}</Label>
      <RelativeWrapper>
        <StyledSelect name={name} id={id} {...restProps}>
          {options.map(option => (
            <option value={option.value}>{option.label}</option>
          ))}
        </StyledSelect>
        <DropdownIcon>
          <Icon name="caret" size={8} />
        </DropdownIcon>
      </RelativeWrapper>
    </Stack>
  );
};
