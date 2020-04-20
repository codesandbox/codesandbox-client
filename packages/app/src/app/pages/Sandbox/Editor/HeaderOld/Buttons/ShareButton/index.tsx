import { useOvermind } from 'app/overmind';
import React, { FunctionComponent } from 'react';

import { Button, ShareIcon } from './elements';

export const ShareButton: FunctionComponent = () => {
  const {
    actions: { modalOpened },
    state: {
      editor: { currentSandbox },
    },
  } = useOvermind();

  return (
    <Button
      onClick={() => modalOpened({ modal: 'share' })}
      secondary={!currentSandbox || !currentSandbox.owned}
      small
    >
      <ShareIcon />
      Share
    </Button>
  );
};
