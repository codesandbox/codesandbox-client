import React, { FunctionComponent } from 'react';

import { Element, Button, Text, Stack } from '@codesandbox/components';
import { useOvermind } from 'app/overmind';
import css from '@styled-system/css';

import { permanentlyDeleteSandboxes } from '../../../Dashboard/queries';

export const EmptyTrash: FunctionComponent = () => {
  const {
    actions: { modalClosed },
    state: {
      dashboard: { trashSandboxIds },
    },
  } = useOvermind();

  return (
    <Element padding={4} paddingTop={6}>
      <Text weight="bold" block size={4} paddingBottom={2}>
        Empty Trash
      </Text>
      <Text marginBottom={6} size={3} block>
        Are you sure you want to permanently delete all the sandboxes in the
        trash?
      </Text>

      <Stack gap={2} align="center" justify="flex-end">
        <Button
          css={css({
            width: 'auto',
          })}
          variant="link"
          onClick={() => modalClosed()}
        >
          Cancel
        </Button>
        <Button
          css={css({
            width: 'auto',
          })}
          variant="danger"
          onClick={async () => {
            await permanentlyDeleteSandboxes(trashSandboxIds);

            modalClosed();
          }}
        >
          Delete
        </Button>
      </Stack>
    </Element>
  );
};
