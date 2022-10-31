import React from 'react';
import { Button, Stack, Text } from '@codesandbox/components';
import { useActions, useAppState } from 'app/overmind';

import css from '@styled-system/css';

export const Patron = () => {
  const { user } = useAppState();
  const actions = useActions();

  return (
    <Stack direction="vertical" gap={2}>
      <Text size={3} variant="muted">
        USD {user?.subscription?.amount}{' '}
      </Text>

      <Button
        autoWidth
        variant="link"
        css={css({
          height: 'auto',
          fontSize: 3,
          color: 'button.background',
          padding: 0,
        })}
        onClick={() => {
          actions.modalOpened({ modal: 'legacyPayment' });
        }}
      >
        Update payment information
      </Button>

      <Button
        autoWidth
        variant="link"
        css={css({
          height: 'auto',
          fontSize: 3,
          color: 'errorForeground',
          padding: 0,
        })}
        onClick={() => actions.patron.cancelSubscriptionClicked()}
      >
        Downgrade plan
      </Button>
    </Stack>
  );
};
