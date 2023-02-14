import { Button, Stack, Text } from '@codesandbox/components';
import css from '@styled-system/css';
import React, { FunctionComponent } from 'react';

import { useAppState, useActions } from 'app/overmind';
import { useWorkspaceSubscription } from 'app/hooks/useWorkspaceSubscription';

import { LiveIcon } from '../icons';

export const Owner: FunctionComponent = () => {
  const { live, modalOpened } = useActions();
  const { isPro } = useWorkspaceSubscription();
  const {
    editor: {
      currentSandbox: { id },
      isAllModulesSynced,
    },
    live: { isLoading },
  } = useAppState();

  const handleGoLive = () => {
    if (isPro) {
      live.createLiveClicked(id);
      return;
    }

    modalOpened({ modal: 'liveSessionConfirm' });
  };

  return (
    <>
      <Stack direction="vertical" gap={2} marginBottom={6}>
        <Text block size={2} variant="muted">
          Invite others to edit this sandbox with you in real time.
        </Text>

        <Text block size={2} variant="muted">
          To invite others you need to generate a URL that others can join.
        </Text>
      </Stack>

      <Button
        disabled={!isAllModulesSynced}
        onClick={handleGoLive}
        variant="danger"
      >
        {isLoading ? (
          'Creating session'
        ) : (
          <>
            <LiveIcon css={css({ marginRight: 2 })} /> <span>Go Live</span>
          </>
        )}
      </Button>
    </>
  );
};
