import React from 'react';
import { hooksObserver, inject } from 'app/componentConnectors';
import { ProgressButton, ForkIcon } from './elements';

export const ForkButton = inject('store', 'signals')(
  hooksObserver(
    ({
      signals: {
        editor: { forkSandboxClicked },
      },
      store: {
        editor: {
          isForkingSandbox,
          currentSandbox: { owned },
        },
      },
    }) => (
      <ProgressButton
        onClick={forkSandboxClicked}
        secondary={owned}
        loading={isForkingSandbox}
        small
      >
        <ForkIcon />
        {isForkingSandbox ? 'Forking...' : 'Fork'}
      </ProgressButton>
    )
  )
);
