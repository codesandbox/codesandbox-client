import React from 'react';
import { useAppState, useActions } from 'app/overmind';

import css from '@styled-system/css';
import { format } from 'date-fns';
import {
  Button,
  Stack,
  Text,
  Link,
  Icon,
  Tooltip,
} from '@codesandbox/components';

export const Paddle = () => {
  const { activeTeamInfo: team } = useAppState();
  const actions = useActions();

  return (
    <Stack direction="vertical" gap={2}>
      {!team.subscription.cancelAt ? (
        <Tooltip
          label={`Next invoice of ${team.subscription.currency} ${(
            (team.subscription.quantity * team.subscription.unitPrice) /
            100
          ).toFixed(2)} (excl. tax) scheduled for ${format(
            new Date(team.subscription.nextBillDate),
            'PP'
          )}`}
        >
          <Stack align="center" gap={1}>
            <Text size={3} variant="muted">
              Next invoice: {team.subscription.currency}{' '}
              {(
                (team.subscription.quantity * team.subscription.unitPrice) /
                100
              ).toFixed(2)}{' '}
            </Text>
            <Text variant="muted">
              <Icon name="info" size={12} />
            </Text>
          </Stack>
        </Tooltip>
      ) : null}

      <Link
        size={3}
        variant="active"
        href={team.subscription.updateBillingUrl}
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

      {team.subscription.cancelAt ? (
        <Text size={3} css={css({ color: '#F7CC66' })}>
          Your subscription expires on{' '}
          {format(new Date(team.subscription.cancelAt), 'PP')}.{' '}
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
    </Stack>
  );
};
