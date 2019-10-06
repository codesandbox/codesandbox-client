import React, { FunctionComponent } from 'react';

import { useOvermind } from 'app/overmind';

import { Button } from './elements';

export const PickButton: FunctionComponent = () => {
  const {
    actions: {
      explore: { pickSandboxModal },
    },
    state: {
      editor: {
        currentSandbox: { description, id, owned, title },
      },
    },
  } = useOvermind();

  const details = {
    description,
    id,
    title,
  };

  return (
    <Button onClick={() => pickSandboxModal(details)} secondary={owned} small>
      Pick
    </Button>
  );
};
