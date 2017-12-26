import React from 'react';
import styled from 'styled-components';
import DeleteIcon from 'react-icons/lib/md/delete';
import Tooltip from 'common/components/Tooltip';

export const DeleteSandboxButton = styled(props => (
  <Tooltip title="Delete Sandbox">
    <button {...props}>
      <DeleteIcon />
    </button>
  </Tooltip>
))`
  font-size: 1.2em;
  background-color: inherit;
  border: none;
  padding: 5px 6px 9px 6px;
  color: rgba(255, 255, 255, 0.5);
  cursor: pointer;
  &:hover {
    color: rgba(255, 255, 255, 1);
  }
`;
