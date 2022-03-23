import React from 'react';
import { format } from 'date-fns';
import css from '@styled-system/css';
import { Button, Stack, Text, Link } from '@codesandbox/components';

import { useAppState, useActions } from 'app/overmind';

export const PaddlePlan = () => {
  const { activeTeamInfo } = useAppState();
  const actions = useActions();

  const activeSubscription = activeTeamInfo?.subscription;

  return (
    <Stack direction="vertical" gap={2}>
      <Link
        size={3}
        variant="active"
        href={activeSubscription.updateBillingUrl}
        css={css({ fontWeight: 'medium' })}
      >
        Update payment information
      </Link>
      <Link
        size={3}
        variant="active"
        href="/pro"
        css={css({ fontWeight: 'medium' })}
      >
        Change billing interval
      </Link>
      {activeSubscription.cancelAt ? (
        <Text size={3} css={css({ color: 'orange' })}>
          Your subscription expires on{' '}
          {format(new Date(activeSubscription.cancelAt), 'PP')}.{' '}
          <Button
            autoWidth
            variant="link"
            css={css({
              color: 'inherit',
              padding: 0,
              textDecoration: 'underline',
              fontSize: 3,
            })}
            onClick={() => actions.pro.reactivateWorkspaceSubscription()}
          >
            Reactivate
          </Button>
        </Text>
      ) : (
        <Button
          autoWidth
          variant="link"
          css={css({
            height: 'auto',
            fontSize: 3,
            color: 'errorForeground',
            padding: 0,
          })}
          onClick={() => actions.pro.cancelWorkspaceSubscription()}
        >
          Cancel subscription
        </Button>
      )}
    </Stack>
  );
};
