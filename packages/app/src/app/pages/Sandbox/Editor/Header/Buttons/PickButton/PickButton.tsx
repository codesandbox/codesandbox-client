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
        currentSandbox: { id, title, description, owned },
      },
    },
  } = useOvermind();

  const details = {
    id,
    title,
    description,
  };

  return (
    <Button
      onClick={() => {
        pickSandboxModal({ details });
      }}
      secondary={owned}
      small
    >
      Pick
    </Button>
  );
};
