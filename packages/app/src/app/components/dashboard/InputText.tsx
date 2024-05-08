import React, { InputHTMLAttributes, forwardRef } from 'react';
import styled from 'styled-components';
import { Element, Stack, Text } from '@codesandbox/components';
import { Label } from './Label';

const StyledInput = styled.input<{ isInvalid?: boolean }>`
  padding: 8px 16px;
  background-color: #2a2a2a;
  font-family: 'Inter', sans-serif;
  font-size: 16px;
  color: #e5e5e5;
  line-height: 24px;
  border: none;
  border-radius: 4px;
  width: 100%;

  ${props => (props.isInvalid ? 'outline: 1px solid #EB5E5E;' : '')}

  &:hover:not(:disabled) {
    box-shadow: 0 0 0 2px #e5e5e51a;
  }

  &:focus {
    outline: 1px solid #ac9cff;
  }

  &:user-invalid {
    outline: 1px solid #eb5e5e;
  }
`;

interface InputTextProps extends InputHTMLAttributes<HTMLInputElement> {
  id: string;
  label: string;
  description?: string;
  name: string;
  isInvalid?: boolean;
  hideLabel?: boolean;
  iconLeft?: React.ReactNode;
}

export const InputText = forwardRef<HTMLInputElement, InputTextProps>(
  (
    {
      id,
      label,
      name,
      isInvalid,
      hideLabel,
      description,
      iconLeft,
      ...restProps
    },
    ref
  ) => (
    <Stack gap={2} direction="vertical">
      {!hideLabel && (
        <Stack gap={1} direction="vertical">
          <Label htmlFor={id}>{label}</Label>
          {description && (
            <Text id={`description-${id}`} color="#999">
              {description}
            </Text>
          )}
        </Stack>
      )}
      <Element css={{ position: 'relative', display: 'flex' }}>
        <StyledInput
          id={id}
          name={name}
          type="text"
          aria-label={label}
          isInvalid={isInvalid}
          ref={ref}
          {...(description
            ? { 'aria-describedby': `description-${id}` }
            : null)}
          {...restProps}
        />
        {!!iconLeft && (
          <Element css={{ position: 'absolute', left: 5, top: 10 }}>
            {iconLeft}
          </Element>
        )}
      </Element>
    </Stack>
  )
);
