import React from 'react';
import PlusIcon from 'react-icons/lib/go/plus';
import { inject, hooksObserver } from 'app/componentConnectors';
import { Action } from './Action';

export const NewSandboxButton = inject('signals')(
  hooksObserver(({ signals: { modalOpened } }) => (
    <Action
      onClick={() => modalOpened({ modal: 'newSandbox' })}
      tooltip="New Sandbox"
      Icon={PlusIcon}
    />
  ))
);
