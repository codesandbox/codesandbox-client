import React from 'react';
import { observer } from 'mobx-react-lite';
import { useSignals, useStore } from 'app/store';
import { Button } from './elements';

export const PickButton = observer(() => {
  const {
    explore: { pickSandboxModal },
  } = useSignals();
  const {
    editor: {
      currentSandbox: { id, title, description, owned },
    },
  } = useStore();

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
});
