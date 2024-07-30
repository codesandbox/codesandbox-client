import styled from 'styled-components';
import React from 'react';
import { Icon, IconNames, Stack, Text } from '@codesandbox/components';

type LargeCTAButtonProps = {
  title: string;
  subtitle?: string;
  disabled?: boolean;
  icon: IconNames;
  variant?: 'primary' | 'secondary';
  alignment?: 'horizontal' | 'vertical';
} & Pick<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onClick'>;

export const LargeCTAButton = ({
  title,
  subtitle,
  icon,
  disabled,
  onClick,
  variant = 'secondary',
  alignment = 'horizontal',
}: LargeCTAButtonProps) => {
  return (
    <StyledButton
      onClick={onClick}
      disabled={disabled}
      style={{
        height: 'auto',
        flexDirection: alignment === 'horizontal' ? 'row' : 'column',
      }}
    >
      <Stack
        justify="center"
        align="center"
        padding={4}
        css={{
          background: variant === 'primary' ? '#E4FC82' : '#CCCCCC',
        }}
      >
        <Icon name={icon} size={48} />
      </Stack>
      <StyledStackContent direction="vertical" gap={2}>
        <Text size={3} color="#121212">
          {title}
        </Text>
        {subtitle && (
          <Text size={2} weight="400" lineHeight="16px" color="#5C5C5C">
            {subtitle}
          </Text>
        )}
      </StyledStackContent>
    </StyledButton>
  );
};

const StyledButton = styled.button`
  all: unset;
  display: flex;
  align-items: stretch;
  padding: 0;
  border: 0;
  border-radius: 4px;
  height: 80px;
  overflow: hidden;
  background-color: #ffffff;
  color: #0e0e0e;
  font-family: inherit;
  font-weight: 500;
  line-height: 16px;
  transition: background-color 75ms ease;

  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }

  &:hover:not(:disabled) {
    background-color: #ededed;
    cursor: pointer;
  }

  &:focus-visible {
    background-color: #ededed;
    outline: 2px solid #9581ff;
  }
`;

const StyledStackContent = styled(Stack)`
  padding: 12px 16px;
  min-height: 80px;
`;
