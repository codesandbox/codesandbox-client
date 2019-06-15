import * as React from 'react';
import DeleteIcon from 'react-icons/lib/md/delete';
import { Container } from './elements';

interface IDeleteSandboxButtonProps {
  id: string;
  onDelete: (id: string) => void;
}

const DeleteSandboxButton = ({
  id,
  onDelete,
  ...props
}: IDeleteSandboxButtonProps) => (
  <Container content="Delete Sandbox" onClick={() => onDelete(id)}>
    <button type="button" {...props}>
      <DeleteIcon />
    </button>
  </Container>
);

export default DeleteSandboxButton;
