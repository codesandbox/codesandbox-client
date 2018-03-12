import * as React from 'react';
import styled from 'app/styled-components';
import DeleteIcon from 'react-icons/lib/md/delete';
import Tooltip from 'common/components/Tooltip';

const DeleteButton: React.SFC<{
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void
}> = props => (
  <Tooltip title="Delete Sandbox">
    <button {...props}>
      <DeleteIcon />
    </button>
  </Tooltip>
)

export const DeleteSandboxButton = styled(DeleteButton)`
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
