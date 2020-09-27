import React from 'react';
import { Stack, Text } from '@codesandbox/components';
import styled, { css } from 'styled-components';

export const FiberIcon = () => (
  <div
    style={{
      borderRadius: 2,
      width: 12,
      height: 12,
      border: '1px solid white',
      opacity: 0.2,
    }}
  />
);

const Container = styled.button<{ selected: boolean }>`
  cursor: pointer;
  display: block;
  width: 100%;
  font-family: 'Inter' sans-serif;
  background-color: transparent;
  outline: none;
  border: none;

  ${props =>
    props.selected &&
    css`
      background-color: ${props => props.theme.colors.grays[600]};
    `}
`;

const DepthOffset = styled(Stack)<{ depth: number; selected: boolean }>`
  display: flex;
  margin-left: ${({ depth }) => depth * 8}px;

  &:hover {
    span {
      transition: 0.15s ease color;

      color: ${props => props.theme.colors.white};
    }
  }

  ${props =>
    props.selected &&
    css`
      span {
        color: ${props => props.theme.colors.white};
      }
    `}
`;

interface FiberProps {
  depth?: number;
  name: string;
  id: string;
  selected: boolean;
  onSelect: (id: string) => void;
  onMouseEnter: (id: string) => void;
  onMouseLeave: (id: string) => void;
}

export const Fiber = ({
  depth = 0,
  name,
  id,
  selected,
  onSelect,
  onMouseEnter,
  onMouseLeave,
}: FiberProps) => (
  <Container
    selected={selected}
    onClick={() => {
      onSelect(id);
    }}
    onMouseEnter={() => {
      onMouseEnter(id);
    }}
    onMouseLeave={() => {
      onMouseLeave(id);
    }}
  >
    <DepthOffset
      selected={selected}
      align="center"
      paddingX={4}
      paddingY={2}
      gap={2}
      depth={depth}
    >
      <FiberIcon />
      <Text variant="muted" weight="medium" size={3}>
        {name}
      </Text>
    </DepthOffset>
  </Container>
);
