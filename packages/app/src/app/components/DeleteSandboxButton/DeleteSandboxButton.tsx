import * as React from 'react';
import { DeleteSandboxButtonContainer } from './elements';

interface Props {
  id: string;
  onDelete: (id: string) => void;
}

export const DeleteSandboxButton = ({ id, onDelete }: Props) => {
  const deleteSandbox = () => {
    onDelete(id);
  };

  return <DeleteSandboxButtonContainer onClick={deleteSandbox} />;
};
