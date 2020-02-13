import React, { FunctionComponent } from 'react';
import PlusIcon from 'react-icons/lib/go/plus';

import { useOvermind } from 'app/overmind';

import { Action } from './Action';

export const NewSandboxButton: FunctionComponent = () => {
  const {
    actions: { modalOpened },
  } = useOvermind();

  return (
    <Action
      Icon={PlusIcon}
      onClick={() => modalOpened({ modal: 'newSandbox' })}
      tooltip="New Sandbox"
    />
  );
};
