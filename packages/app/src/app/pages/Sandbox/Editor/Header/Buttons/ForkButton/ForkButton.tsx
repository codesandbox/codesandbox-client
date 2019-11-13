import React, { FunctionComponent } from 'react';

import { useOvermind } from 'app/overmind';

import { ProgressButton, ForkIcon } from './elements';

export const ForkButton: FunctionComponent = () => {
  const {
    actions: {
      editor: { forkSandboxClicked },
    },
    state: {
      editor: {
        isForkingSandbox,
        currentSandbox: { owned },
      },
    },
  } = useOvermind();

  return (
    <ProgressButton
      loading={isForkingSandbox}
      onClick={forkSandboxClicked}
      secondary={owned}
      small
    >
      <ForkIcon />

      {isForkingSandbox ? 'Forking...' : 'Fork'}
    </ProgressButton>
  );
};
