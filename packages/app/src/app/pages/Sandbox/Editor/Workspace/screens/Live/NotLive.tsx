import React from 'react';
import css from '@styled-system/css';

import {
  Element,
  Collapsible,
  Stack,
  Text,
  Button,
} from '@codesandbox/components';
import { useOvermind } from 'app/overmind';

const LiveIcon = props => (
  <Element
    as="svg"
    width="8"
    height="8"
    viewBox="0 0 8 8"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <circle cx="4" cy="4" r="4" fill="currentcolor" />
  </Element>
);

export const NotLive = () => {
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
    <Collapsible title="Live" defaultOpen>
      <Element css={css({ paddingX: 2 })}>
        <Text block weight="medium" marginBottom={2}>
          Collaborate in real-time
        </Text>

        <Stack direction="vertical" gap={2} marginBottom={6}>
          <Text size={2} variant="muted" block>
            Invite others to live edit this sandbox with you.
          </Text>
          <Text size={2} variant="muted" block>
            To invite others you need to generate a URL that others can join.
          </Text>
        </Stack>
        <Button
          variant="danger"
          disabled={!isAllModulesSynced}
          onClick={() => createLiveClicked(id)}
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
      </Element>
    </Collapsible>
  );
};
