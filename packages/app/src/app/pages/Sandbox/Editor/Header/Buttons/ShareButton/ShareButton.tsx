import React, { FunctionComponent } from 'react';

import { useOvermind } from 'app/overmind';

import { Button, ShareIcon } from './elements';

export const ShareButton: FunctionComponent = () => {
  const {
    actions: { modalOpened },
    state: {
      editor: {
        currentSandbox: { owned },
      },
    },
  } = useOvermind();

  return (
    <Button
      onClick={() => modalOpened({ message: null, modal: 'share' })}
      secondary={!owned}
      small
    >
      <ShareIcon />
      Share
    </Button>
  );
};
