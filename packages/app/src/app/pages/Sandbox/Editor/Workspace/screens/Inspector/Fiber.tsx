import React from 'react';
import { Stack, Text } from '@codesandbox/components';
import styled from 'styled-components';

export const FiberIcon = () => {
  return (
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
};

const Container = styled.button`
  cursor: pointer;
  display: block;
  width: 100%;
  font-family: 'Inter' sans-serif;
  background-color: transparent;
  outline: none;
  border: none;
`;

const DepthOffset = styled(Stack)<{ depth: number }>`
  display: flex;
  margin-left: ${({ depth }) => depth * 8}px;

  &:hover {
    span {
      transition: 0.15s ease color;

      color: white;
    }
  }
`;

interface FiberProps {
  depth?: number;
  name: string;
  id: string;
  onSelect: (id: string) => void;
}

export const Fiber = ({ depth = 0, name, id, onSelect }: FiberProps) => {
  return (
    <Container
      onClick={() => {
        onSelect(id);
      }}
    >
      <DepthOffset
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
};
