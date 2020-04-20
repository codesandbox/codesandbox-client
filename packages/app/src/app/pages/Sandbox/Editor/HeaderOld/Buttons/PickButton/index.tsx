import { useOvermind } from 'app/overmind';
import React, { FunctionComponent } from 'react';

import { Button } from './elements';

export const PickButton: FunctionComponent = () => {
  const {
    actions: {
      explore: { pickSandboxModal },
    },
    state: {
      editor: { currentSandbox },
    },
  } = useOvermind();

  return (
    <Button
      onClick={() =>
        pickSandboxModal({
          description: currentSandbox.description,
          id: currentSandbox.id,
          title: currentSandbox.title,
        })
      }
      secondary={currentSandbox && currentSandbox.owned}
      small
    >
      Pick
    </Button>
  );
};
