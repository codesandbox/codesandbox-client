import styled from 'styled-components';
import React from 'react';
import { Icon, IconNames, Stack, Text } from '@codesandbox/components';

type LargeCTAButtonProps = {
  title: string;
  subtitle?: string;
  icon: IconNames;
  variant?: 'primary' | 'secondary';
  alignment?: 'horizontal' | 'vertical';
} & Pick<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onClick'>;

export const LargeCTAButton = ({
  title,
  subtitle,
  icon,
  onClick,
  variant = 'secondary',
  alignment = 'horizontal',
}: LargeCTAButtonProps) => {
  return (
    <StyledButton
      onClick={onClick}
      css={{
        height: alignment === 'horizontal' ? '80px' : 'auto',
        flexDirection: alignment === 'horizontal' ? 'row' : 'column',
      }}
    >
      <Stack
        justify="center"
        padding={4}
        css={{
          background: variant === 'primary' ? '#E4FC82' : '#CCCCCC',
        }}
      >
        <Icon name={icon} size={48} />
      </Stack>
      <Stack direction="vertical" gap={1} css={{ padding: '16px' }}>
        <Text size={3} color="#121212">
          {title}
        </Text>
        {subtitle && (
          <Text size={2} weight="400" color="#5C5C5C">
            {subtitle}
          </Text>
        )}
      </Stack>
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

  &:hover {
    background-color: #ebebeb;
    cursor: pointer;
    transition: background-color 75ms ease;
  }

  &:focus-visible {
    outline: 2px solid #9581ff;
  }
`;
