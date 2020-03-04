import { useOvermind } from 'app/overmind';
import React, { FunctionComponent } from 'react';

import { ForkIcon, ProgressButton } from './elements';

export const ForkButton: FunctionComponent = () => {
  const {
    actions: {
      editor: { forkSandboxClicked },
    },
    state: {
      editor: { currentSandbox, isForkingSandbox },
    },
  } = useOvermind();

  return (
    <ProgressButton
      loading={isForkingSandbox}
      onClick={forkSandboxClicked}
      secondary={currentSandbox && currentSandbox.owned}
      small
    >
      <ForkIcon />

      {isForkingSandbox ? 'Forking...' : 'Fork'}
    </ProgressButton>
  );
};
