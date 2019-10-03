import Tooltip from '@codesandbox/common/lib/components/Tooltip';
import React, { FunctionComponent } from 'react';
import PlusIcon from 'react-icons/lib/go/plus';

import { useOvermind } from 'app/overmind';

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
        <PlusIcon height={35} />
      </Tooltip>
    </Action>
  );
};
