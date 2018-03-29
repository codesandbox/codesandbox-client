import * as React from 'react';
import styled, { css, component } from 'app/styled-components';
import Tooltip from 'common/components/Tooltip';
import fadeIn from 'common/utils/animation/fade-in';

import Save from 'react-icons/lib/md/save';

const Container = styled(component<{
  disabled?: boolean
  onClick: () => void
}>())`
  transition: 0.3s ease opacity;
  font-size: 0.875rem;
  opacity: 0.6;
  cursor: pointer;

  ${fadeIn()};

  color: rgba(255, 255, 255, 0.6);
  &:hover {
    color: white;
  }

  ${props =>
    props.disabled &&
    css`
      color: rgba(255, 255, 255, 0.3);
      cursor: initial;

      &:hover {
        color: rgba(255, 255, 255, 0.3);
      }
    `};
`;

export default ({ onClick, disabled }) => (
  <Container disabled={disabled} onClick={disabled ? undefined : onClick}>
    <Tooltip title={disabled ? 'Everything is saved' : 'Save All Modules'}>
      <Save />
    </Tooltip>
  </Container>
);
