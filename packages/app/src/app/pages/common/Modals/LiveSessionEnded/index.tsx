import React, { FunctionComponent } from 'react';

import { Element, Button, Text, Stack } from '@codesandbox/components';
import { useOvermind } from 'app/overmind';
import css from '@styled-system/css';

export const LiveSessionEnded: FunctionComponent = () => {
  const {
    actions: {
      editor: { forkSandboxClicked },
      modalClosed,
    },
    state: {
      currentModalMessage,
      editor: { currentSandbox },
    },
  } = useOvermind();
  if (!currentSandbox) return null;
  const { owned } = currentSandbox;

  const suggestion = owned
    ? 'you can continue working on the current sandbox.'
    : 'you can continue working by forking the sandbox or by creating a new sandbox.';

  return (
    <Element padding={4} paddingTop={6}>
      <Text weight="bold" block size={4} paddingBottom={2}>
        The live session has ended
      </Text>
      <Text marginBottom={6} size={3} block>
        {currentModalMessage || 'The session has ended due to inactivity'},{' '}
        {suggestion}
      </Text>

      <Stack gap={2} align="center" justify="flex-end">
        {owned ? (
          <Button
            css={css({
              width: 'auto',
            })}
            variant="link"
            onClick={modalClosed}
          >
            Close Modal
          </Button>
        ) : (
          <Button
            css={css({
              width: 'auto',
            })}
            onClick={() => {
              forkSandboxClicked();
              modalClosed();
            }}
            variant="link"
          >
            Fork Sandbox
          </Button>
        )}
        <Button
          as="a"
          href="/s"
          css={css({
            width: 'auto',
            textDecoration: 'none',
          })}
          onClick={() => modalClosed()}
        >
          Create Sandbox
        </Button>
      </Stack>
    </Element>
  );
};
