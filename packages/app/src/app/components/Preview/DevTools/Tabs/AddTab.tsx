import React from 'react';
import styled from 'styled-components';

import PlusIcon from 'react-icons/lib/go/plus';
import ContextMenu from 'app/components/ContextMenu';

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
          icon: PlusIcon,
          action: () => true,
        },
      ]}
    >
      {onContextMenu => (
        <Container onClick={onContextMenu}>
          <PlusIcon />
        </Container>
      )}
    </ContextMenu>
  );
}
