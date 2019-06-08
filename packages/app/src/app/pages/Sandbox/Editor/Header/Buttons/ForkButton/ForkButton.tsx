import React from 'react';
import { observer } from 'mobx-react-lite';
import { useSignals, useStore } from 'app/store';
import { ProgressButton, ForkIcon } from './elements';

export const ForkButton = observer(() => {
  const {
    editor: { forkSandboxClicked },
  } = useSignals();
  const {
    editor: {
      isForkingSandbox,
      currentSandbox: { owned },
    },
  } = useStore();

  return (
    <ProgressButton
      onClick={() => {
        forkSandboxClicked();
      }}
      secondary={owned}
      loading={isForkingSandbox}
      small
    >
      <>
        <ForkIcon />
        {isForkingSandbox ? 'Forking...' : 'Fork'}
      </>
    </ProgressButton>
  );
});
