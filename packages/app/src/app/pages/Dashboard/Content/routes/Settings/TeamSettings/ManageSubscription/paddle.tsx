import React from 'react';
import { useActions } from 'app/overmind';

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
import { useWorkspaceSubscription } from 'app/hooks/useWorkspaceSubscription';

export const Paddle = () => {
  const { subscription } = useWorkspaceSubscription();
  const actions = useActions();

  if (!subscription.cancelAt) {
    return (
      <Stack
        css={{
          height: '100%',
        }}
        direction="vertical"
        justify="space-between"
      >
        <Text size={3} css={{ color: '#F7CC66' }}>
          Your access to Pro features will expire on on{' '}
          {format(new Date(subscription.cancelAt), 'PP')}. After this period,
          your team will be automatically migrated to the Free plan.
        </Text>
        <Button
          autoWidth
          variant="link"
          css={css({
            color: '#F7CC66',
            padding: 0,
            fontSize: 3,
          })}
          onClick={() => actions.pro.reactivateWorkspaceSubscription()}
        >
          Upgrade to pro
        </Button>
      </Stack>
    );
  }

  return (
    <Stack direction="vertical" gap={2}>
      <Tooltip
        label={`Next invoice of ${subscription.currency} ${(
          (subscription.quantity * subscription.unitPrice) /
          100
        ).toFixed(2)} (excl. tax) scheduled for ${format(
          new Date(subscription.nextBillDate),
          'PP'
        )}`}
      >
        <Stack align="center" gap={1}>
          <Text size={3} variant="muted">
            Next invoice: {subscription.currency}{' '}
            {((subscription.quantity * subscription.unitPrice) / 100).toFixed(
              2
            )}{' '}
          </Text>
          <Text variant="muted">
            <Icon name="info" size={12} />
          </Text>
        </Stack>
      </Tooltip>
      <Link
        size={3}
        variant="active"
        href={subscription.updateBillingUrl}
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
      <Button
        autoWidth
        variant="link"
        css={css({
          height: 'auto',
          fontSize: 3,
          color: 'errorForeground',
          padding: 0,
        })}
        onClick={() => actions.openCancelSubscriptionModal()}
      >
        Cancel subscription
      </Button>
    </Stack>
  );
};
