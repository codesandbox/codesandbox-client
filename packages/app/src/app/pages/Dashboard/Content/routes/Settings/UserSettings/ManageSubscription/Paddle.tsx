import React from 'react';
import { format } from 'date-fns';
import {
  Stack,
  Text,
  Tooltip,
  Icon,
  Button,
  Link,
} from '@codesandbox/components';
import { useAppState, useActions } from 'app/overmind';
import css from '@styled-system/css';

export const Paddle = () => {
  const { activeTeamInfo } = useAppState();
  const actions = useActions();

  const activeSubscription = activeTeamInfo?.subscription;

  if (activeTeamInfo?.subscription.cancelAt) {
    return null;
  }

  return (
    <>
      <Tooltip
        label={`Next invoice of ${activeTeamInfo?.subscription.currency} ${(
          (activeTeamInfo?.subscription.quantity *
            activeTeamInfo?.subscription.unitPrice) /
          100
        ).toFixed(2)} (excl. tax) scheduled for ${format(
          new Date(activeTeamInfo?.subscription.nextBillDate),
          'PP'
        )}`}
      >
        <Stack align="center" gap={1}>
          <Text size={3} variant="muted">
            Next invoice: {activeTeamInfo?.subscription.currency}{' '}
            {(
              (activeTeamInfo?.subscription.quantity *
                activeTeamInfo?.subscription.unitPrice) /
              100
            ).toFixed(2)}{' '}
          </Text>
          <Text variant="muted">
            <Icon name="info" size={12} />
          </Text>
        </Stack>
      </Tooltip>

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
        <Text size={3} css={css({ color: '#F7CC66' })}>
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
            Reactivate subscription
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
    </>
  );
};
