import React from 'react';
import { Button, Stack } from '@codesandbox/components';
import { useActions } from 'app/overmind';

import css from '@styled-system/css';

export const PatronPlan = () => {
  const actions = useActions();

  return (
    <Stack direction="vertical" gap={2}>
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
          actions.modalOpened({
            modal: 'preferences',
            itemId: 'paymentInfo',
          });
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
