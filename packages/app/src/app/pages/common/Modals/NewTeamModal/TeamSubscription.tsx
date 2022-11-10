import React from 'react';
import css from '@styled-system/css';

import { dashboard } from '@codesandbox/common/lib/utils/url-generator';
import { Button, Icon, Stack, Text } from '@codesandbox/components';
import history from 'app/utils/history';
import { useActions, useAppState } from 'app/overmind';
import { TeamAvatar } from 'app/components/TeamAvatar';
import { formatCurrency } from 'app/utils/currency';
import { useCreateCheckout } from 'app/hooks';
import { TeamMemberAuthorization } from 'app/graphql/types';
import track from '@codesandbox/common/lib/utils/analytics';

type Feature = {
  key: string;
  label: string;
  icon: React.ComponentProps<typeof Icon>['name'];
};
const FEATURES: Feature[] = [
  { key: 'editors', label: 'Up to 20 editors', icon: 'profile' },
  {
    key: 'limit',
    label: 'Unlimited sandboxes and repositories',
    icon: 'CodeSandboxIcon',
  },
  { key: 'npm', label: 'Private NPM packages', icon: 'npm' },
  {
    key: 'privacy',
    label: 'Private repositories and advanced permissions',
    icon: 'lock',
  },
  { key: 'vm', label: '6GB RAM, 12GB Disk, 4 vCPUs', icon: 'server' },
];

const pricingLabel = (
  price: { currency: string; unitAmount: number } | undefined
) => {
  if (typeof price === 'undefined') {
    return '';
  }

  return ` ${formatCurrency({
    currency: price.currency,
    amount: price.unitAmount,
  })} ${price.currency.toUpperCase()} per editor per month`;
};

export const TeamSubscription: React.FC = () => {
  const { activeTeamInfo, user, pro } = useAppState();
  const {
    pro: { pageMounted },
    modalClosed,
  } = useActions();
  const [checkout, createCheckout] = useCreateCheckout();

  React.useEffect(() => {
    pageMounted();
  }, [pageMounted]);

  React.useEffect(() => {
    track('New Team - View Team Pro Trial CTA', {
      codesandbox: 'V1',
      event_source: 'UI',
    });
  }, []);

  const handleDismiss = () => {
    modalClosed();
    history.push(dashboard.recent(activeTeamInfo.id));
  };

  // Only teams that never had a subscription are elligible for
  // the 14-day free trial.
  const isEligibleForTrial = activeTeamInfo.subscription === null;
  const usersPermission = activeTeamInfo?.userAuthorizations.find(item => {
    return item.userId === user.id;
  });
  const isAdmin =
    usersPermission?.authorization === TeamMemberAuthorization.Admin;

  const checkoutBtnDisabled =
    !isEligibleForTrial || !isAdmin || checkout.status === 'loading';

  return (
    <Stack
      css={css({
        width: '100%',
        flex: 1,
      })}
      align="center"
      direction="vertical"
    >
      <Stack
        css={css({
          width: '396px',
          flex: 1,
        })}
        align="center"
        direction="vertical"
        gap={6}
      >
        <Stack direction="vertical" gap={3}>
          <Stack align="center" justify="center" gap={3}>
            <TeamAvatar
              avatar={activeTeamInfo.avatarUrl}
              name={activeTeamInfo.name}
            />
            <Text as="p" size={3}>
              {activeTeamInfo.name}
            </Text>
          </Stack>
          <Text
            as="h2"
            css={{
              fontFamily: 'Everett, sans-serif',
              fontWeight: 500,
              fontSize: '32px',
              lineHeight: '42px',
              letterSpacing: '-0.01em',
              margin: 0,
            }}
            size={8}
          >
            {isEligibleForTrial
              ? 'Try Team Pro for free'
              : 'Upgrade to Team Pro'}
          </Text>
        </Stack>
        <Stack
          as="ul"
          css={css({
            width: '100%',
            margin: 0,
            padding: 2,
            listStyle: 'none',
            background: '#161616',
            borderRadius: '4px',
          })}
          direction="vertical"
          gap={1}
        >
          {FEATURES.map(feature => (
            <Stack
              key={feature.key}
              as="li"
              css={css({
                color: '#C2C2C2',
                paddingX: 4,
                paddingY: 3,
              })}
              align="center"
              gap={3}
            >
              <Icon name={feature.icon} />
              <Text size={3}>{feature.label}</Text>
            </Stack>
          ))}
        </Stack>
        <Stack css={{ width: '100%' }} direction="vertical" gap={4}>
          <Stack direction="vertical" align="center" gap={1}>
            <Button
              css={css({
                height: '32px',
              })}
              onClick={() => {
                if (checkoutBtnDisabled) {
                  return;
                }

                track('New Team - Start Trial', {
                  codesandbox: 'V1',
                  event_source: 'UI',
                });

                createCheckout({
                  team_id: activeTeamInfo.id,
                  recurring_interval: 'month' as string,
                  success_path: dashboard.recent(activeTeamInfo.id),
                  cancel_path: dashboard.recent(activeTeamInfo.id),
                });
              }}
              loading={checkout.status === 'loading'}
              disabled={checkoutBtnDisabled}
              type="button"
            >
              {isEligibleForTrial
                ? 'Start 14 day free trial'
                : 'Proceed to checkout'}
            </Button>
            {checkout.status === 'error' && (
              <Text variant="danger" size={2}>
                {checkout.error}. Please try again.
              </Text>
            )}
          </Stack>
          <Button
            onClick={() => {
              track('New Team - Skip trial', {
                codesandbox: 'V1',
                event_source: 'UI',
              });
              handleDismiss();
            }}
            variant="link"
          >
            Continue with free plan
          </Button>
        </Stack>
      </Stack>
      {isEligibleForTrial ? (
        <Stack
          css={css({
            width: '100%',
            padding: 6,
            borderTop: '1px solid rgba(153, 153, 153, 0.2)',
          })}
          direction="vertical"
        >
          <Text css={css({ color: '#999999' })} size={2}>
            You&apos;ll be notified before trial ends.
          </Text>
          <Text css={css({ color: '#999999' })} size={2}>
            {`After trial, you will be charged${pricingLabel(
              pro.prices?.teamPro.month
            )}`}
            . Taxes may apply.
          </Text>
        </Stack>
      ) : null}
    </Stack>
  );
};
