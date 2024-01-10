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
import track from '@codesandbox/common/lib/utils/analytics';

export const Paddle = () => {
  const { subscription } = useWorkspaceSubscription();
  const actions = useActions();

  if (subscription.cancelAt) {
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
          onClick={() => {
            track('Team Settings - Renew subscription', {
              codesandbox: 'V1',
              event_source: 'UI',
            });

            actions.pro.reactivateWorkspaceSubscription();
          }}
        >
          Upgrade to pro
        </Button>
      </Stack>
    );
  }

  const nextInvoiceDate = format(new Date(subscription.nextBillDate), 'PP');
  const nextInvoiceValue = (
    (subscription.quantity * subscription.unitPrice) /
    100
  ).toFixed(2);
  return (
    <Stack direction="vertical" gap={2}>
      <Tooltip
        label={`Next invoice of ${subscription.currency} ${nextInvoiceValue} (excl. tax) scheduled for ${nextInvoiceDate}`}
      >
        <Stack align="center" gap={1}>
          <Text size={3} variant="muted">
            Next invoice: {subscription.currency} {nextInvoiceValue}{' '}
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
        onClick={() =>
          track('Team Settings - Update payment details', {
            codesandbox: 'V1',
            event_source: 'UI',
          })
        }
      >
        Update payment information
      </Link>
      <Link
        size={3}
        variant="active"
        href="/pro"
        css={css({ fontWeight: 'medium' })}
        onClick={() =>
          track('Team Settings - Update billing interval', {
            codesandbox: 'V1',
            event_source: 'UI',
          })
        }
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
        onClick={() => {
          track('Team Settings: open cancel subscription modal', {
            codesandbox: 'V1',
            event_source: 'UI',
          });

          actions.openCancelSubscriptionModal();
        }}
      >
        Cancel subscription
      </Button>
    </Stack>
  );
};
