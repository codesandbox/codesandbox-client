import { ContextMenu } from 'app/components/ContextMenu';
import React from 'react';
import { GoPlus } from 'react-icons/go';
import styled from 'styled-components';

const Container = styled.button`
  transition: 0.3s ease color;
  display: flex;
  height: 100%;

  align-items: center;
  font-size: 0.8rem;
  padding: 0 1rem;

  outline: none;
  border: none;
  background-color: transparent;
  color: inherit;

  cursor: pointer;

  &:hover {
    color: white;
  }
`;

export function AddTab() {
  return (
    <ContextMenu
      childFunction
      items={[
        {
          title: 'Browser Pane',
          icon: GoPlus,
          action: () => true,
        },
      ]}
    >
      {onContextMenu => (
        <Container onClick={onContextMenu}>
          <GoPlus />
        </Container>
      )}
    </ContextMenu>
  );
}
