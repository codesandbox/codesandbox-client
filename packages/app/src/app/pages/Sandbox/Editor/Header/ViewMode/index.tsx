import * as React from 'react';
import styled from 'styled-components';

import EyeIcon from 'react-icons/lib/fa/eye';
import ChevronDown from 'react-icons/lib/md/keyboard-arrow-down';

const Container = styled.div`
  display: flex;
  height: 100%;
  align-items: center;
  margin-left: 2rem;
  font-size: 0.75rem;
`;

const ViewButton = styled.div`
  display: flex;
  align-items: center;
  padding: 4px 1rem;
  background-color: ${props => props.theme.secondary};
  color: white;
  font-weight: 400;
  border-radius: 4px;
  font-family: 'Poppins';

  svg {
    height: 100%;
  }
`;

const Text = styled.span`
  display: block;
  margin: 0 0.5rem;
  margin-right: 0.75rem;
`;

export function ViewMode() {
  return (
    <Container>
      <ViewButton>
        <EyeIcon />
        <Text>Viewing</Text>
        <ChevronDown />
      </ViewButton>
    </Container>
  );
}
