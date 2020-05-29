import Tooltip from '@codesandbox/common/es/components/Tooltip';
import { useOvermind } from 'app/overmind';
import React, { FunctionComponent } from 'react';
import { MdDelete } from 'react-icons/md';

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
        <MdDelete />
      </Button>
    </Tooltip>
  );
};
