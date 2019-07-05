import React from 'react';
import { observer } from 'mobx-react-lite';
import { useSignals, useStore } from 'app/store';
import { Button, ShareIcon } from './elements';

export const ShareButton = observer(() => {
  const { modalOpened } = useSignals();
  const {
    editor: {
      currentSandbox: { owned },
    },
  } = useStore();

  return (
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
  );
});
