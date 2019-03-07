import React from 'react';
import styled from 'styled-components';
import AddIcon from 'react-icons/lib/md/add';
import Tooltip from 'common/lib/components/Tooltip';

export const AddFileToSandboxButton = styled(props => (
  <Tooltip content="Add file to sandbox">
    <button {...props}>
      <AddIcon />
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
  &[disabled] {
    opacity: 0.5;
    cursor: default;
  }
`;
