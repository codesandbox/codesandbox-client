import { Button, Stack, Text } from '@codesandbox/components';
import css from '@styled-system/css';
import React, { FunctionComponent } from 'react';

import { useAppState, useActions } from 'app/overmind';

import { LiveIcon } from '../icons';

export const Owner: FunctionComponent = () => {
  const { createLiveClicked } = useActions().live;
  const {
    editor: {
      currentSandbox: { id },
      isAllModulesSynced,
    },
    live: { isLoading },
  } = useAppState();

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
        onClick={() => createLiveClicked(id)}
        variant="danger"
      >
        {isLoading ? (
          'Creating session'
        ) : (
          <>
            <LiveIcon css={css({ marginRight: 2 })} />

            <span>Go Live</span>
          </>
        )}
      </Button>
    </>
  );
};
