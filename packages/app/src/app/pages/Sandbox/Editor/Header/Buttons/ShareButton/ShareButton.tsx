import React from 'react';
import { inject, hooksObserver } from 'app/componentConnectors';
import { Button, ShareIcon } from './elements';

export const ShareButton = inject('store', 'signals')(
  hooksObserver(
    ({
      signals: { modalOpened },
      store: {
        editor: {
          currentSandbox: { owned },
        },
      },
    }) => (
      <Button
        onClick={() => {
          modalOpened({ modal: 'share' });
        }}
        secondary={!owned}
        small
      >
        <ShareIcon />
        Share
      </Button>
    )
  )
);
