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
    editor: { currentSandbox, isAllModulesSynced },
    live: { isLoading },
  } = useAppState();

  const id = currentSandbox.id;
  const restrictions = currentSandbox?.restrictions;

  const handleGoLive = () => {
    // Check the liveSessionsRestricted flag has been toggled. We can remove this
    // after we're sure it is turned on.
    if (typeof restrictions?.liveSessionsRestricted !== 'undefined') {
      if (restrictions.liveSessionsRestricted) {
        // Show modal that its restricted
        modalOpened({ modal: 'liveSessionRestricted' });
      } else {
        live.createLiveClicked(id);
      }

      return;
    }

    // If liveSessionsRestricted flag has been toggled we can remove the logic
    // below and rely on that instead.
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
