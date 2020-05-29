import Tooltip from '@codesandbox/common/es/components/Tooltip';
import { useOvermind } from 'app/overmind';
import React, { FunctionComponent } from 'react';
import { GoPlus } from 'react-icons/go';

import { Action } from '../elements';

export const NewSandboxAction: FunctionComponent = () => {
  const {
    actions: { modalOpened },
  } = useOvermind();

  return (
    <Action
      aria-label="New Sandbox"
      as="button"
      onClick={() => modalOpened({ modal: 'newSandbox' })}
      style={{ fontSize: '1.125rem' }}
    >
      <Tooltip content="New Sandbox" placement="bottom">
        <GoPlus height={35} />
      </Tooltip>
    </Action>
  );
};
