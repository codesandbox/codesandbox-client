import React from 'react';
import EyeIcon from 'react-icons/lib/fa/eye';
import ChevronDown from 'react-icons/lib/md/keyboard-arrow-down';
import { Container, ViewButton, Text } from './elements';

export const ViewMode = () => (
  <Container>
    <ViewButton>
      <EyeIcon />
      <Text>Viewing</Text>
      <ChevronDown />
    </ViewButton>
  </Container>
);
