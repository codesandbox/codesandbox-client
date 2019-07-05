import React from 'react';
import PlusIcon from 'react-icons/lib/go/plus';
import { useSignals } from 'app/store';
import { Action } from './Action';

export const NewSandboxButton = () => {
  const { modalOpened } = useSignals();

  return (
    <Action
      onClick={() => modalOpened({ modal: 'newSandbox' })}
      tooltip="New Sandbox"
      Icon={PlusIcon}
    />
  );
};
