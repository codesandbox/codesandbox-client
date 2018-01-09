import React from 'react';
import styled from 'styled-components';
import Tooltip from 'common/components/Tooltip';
import fadeIn from 'common/utils/animation/fade-in';

import Save from 'react-icons/lib/md/save';

const Container = styled.div`
  transition: 0.3s ease opacity;
  font-size: 0.875rem;
  opacity: 0.6;
  cursor: pointer;

  ${fadeIn()};

  color: rgba(255, 255, 255, 0.6);
  &:hover {
    color: white;
  }
`;

export default ({ onClick }) => (
  <Container onClick={onClick}>
    <Tooltip title="Save All Modules">
      <Save />
    </Tooltip>
  </Container>
);
