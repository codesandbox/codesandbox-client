import { Button, Stack, Text } from '@codesandbox/components';
import css from '@styled-system/css';
import React, { FunctionComponent } from 'react';

import { useOvermind } from 'app/overmind';

import { LiveIcon } from '../icons';

export const Owner: FunctionComponent = () => {
  const {
    actions: {
      live: { createLiveClicked },
    },
    state: {
      editor: {
        currentSandbox: { id },
        isAllModulesSynced,
      },
      live: { isLoading },
    },
  } = useOvermind();

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
