import Tooltip from '@codesandbox/common/lib/components/Tooltip';
import React, { FunctionComponent } from 'react';
import DeleteIcon from 'react-icons/lib/md/delete';

import { useOvermind } from 'app/overmind';

import { Button } from './elements';

type Props = {
  id: string;
};
export const DeleteSandboxButton: FunctionComponent<Props> = ({ id }) => {
  const {
    actions: {
      profile: { deleteSandboxClicked },
    },
  } = useOvermind();

  return (
    <Tooltip content="Delete Sandbox">
      <Button onClick={() => deleteSandboxClicked(id)}>
        <DeleteIcon />
      </Button>
    </Tooltip>
  );
};
