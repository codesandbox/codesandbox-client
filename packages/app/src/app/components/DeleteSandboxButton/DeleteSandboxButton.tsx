import * as React from 'react';
import DeleteIcon from 'react-icons/lib/md/delete';
import { Button } from './elements';
import Tooltip from '@codesandbox/common/lib/components/Tooltip';

interface IDeleteSandboxButtonProps {
  id: string;
  onDelete: (id: string) => void;
}

export const DeleteSandboxButton: React.FC<IDeleteSandboxButtonProps> = ({
  id,
  onDelete,
  ...props
}) => (
  <Tooltip content="Delete Sandbox">
    <Button type="button" {...props} onClick={() => onDelete(id)}>
      <DeleteIcon />
    </Button>
  </Tooltip>
);
