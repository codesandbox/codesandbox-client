import React, { FunctionComponent } from 'react';

import { Element, Button, Text, Stack } from '@codesandbox/components';
import { useOvermind } from 'app/overmind';
import css from '@styled-system/css';

export const DeleteProfileSandboxModal: FunctionComponent = () => {
  const {
    actions: {
      modalClosed,
      profile: { sandboxDeleted },
    },
  } = useOvermind();

  return (
    <Element padding={4} paddingTop={6}>
      <Text weight="bold" block size={4} paddingBottom={2}>
        Delete Sandbox
      </Text>
      <Text marginBottom={6} size={3} block>
        Are you sure you want to delete this sandbox?
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
          onClick={() => sandboxDeleted()}
        >
          Delete
        </Button>
      </Stack>
    </Element>
  );
};
