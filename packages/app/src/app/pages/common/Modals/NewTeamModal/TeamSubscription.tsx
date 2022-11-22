import React from 'react';
import css from '@styled-system/css';

import { dashboard } from '@codesandbox/common/lib/utils/url-generator';
import { Button, Stack, Text } from '@codesandbox/components';
import history from 'app/utils/history';
import { useActions, useAppState } from 'app/overmind';
import { TeamAvatar } from 'app/components/TeamAvatar';
import { formatCurrency } from 'app/utils/currency';
import { useCreateCheckout } from 'app/hooks';
import { useWorkspaceAuthorization } from 'app/hooks/useWorkspaceAuthorization';
import { useSubscription } from 'app/hooks/useSubscription';
import track from '@codesandbox/common/lib/utils/analytics';

type Feature = {
  key: string;
  label: string;
  pill?: string;
};

const FREE_FEATURES: Feature[] = [
  { key: 'editors', label: 'Up to 5 editors' },
  {
    key: 'limit_sandboxes',
    label: '20 public sandboxes',
  },
  {
    key: 'limit_repositories',
    label: '3 public repositories',
  },
  { key: 'npm', label: 'Public NPM packages' },
  { key: 'vm_mem', label: '4GB RAM' },
  { key: 'vm_cpu', label: '2vCPUs' },
  { key: 'vm_disk', label: '4GB Disk' },
];
const PRO_FEATURES: Feature[] = [
  { key: 'editors', label: 'Up to 20 editors' },
  {
    key: 'limit_sandboxes',
    label: 'Unlimited private sandboxes',
  },
  {
    key: 'limit_repositories',
    label: 'Unlimited private repositories',
  },
  { key: 'npm', label: 'Private NPM packages' },
  { key: 'vm_mem', label: '6GB RAM', pill: '1.5x capacity' },
  { key: 'vm_cpu', label: '4vCPUs', pill: '2x faster' },
  { key: 'vm_disk', label: '12GB Disk', pill: '3x storage' },
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
  const { activeTeamInfo, pro } = useAppState();
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

  const { isTeamAdmin } = useWorkspaceAuthorization();
  const { isEligibleForTrial } = useSubscription();

  const isCheckoutDisabled =
    !isEligibleForTrial || !isTeamAdmin || checkout.status === 'loading';

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
          width: '510px',
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
          css={css({
            width: '510px',
            flex: 1,
          })}
          gap={2}
        >
          <FeatureList
            title="Free Plan"
            features={FREE_FEATURES}
            background="#1c1c1c"
            textColor="#c2c2c2"
          />
          <FeatureList
            title="Team Pro"
            features={PRO_FEATURES}
            background="white"
            textColor="#0E0E0E"
          />
        </Stack>

        <Stack
          css={{ width: '100%', paddingBottom: 12 }}
          direction="vertical"
          gap={4}
        >
          <Stack direction="vertical" align="center" gap={1}>
            <Button
              css={css({
                height: '32px',
              })}
              onClick={() => {
                if (isCheckoutDisabled) {
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
              disabled={isCheckoutDisabled}
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

const FeatureList = ({
  features,
  background,
  textColor,
  title,
}: {
  features: Feature[];
  background: string;
  textColor: string;
  title: string;
}) => (
  <Stack
    css={css({
      color: textColor,
      width: '100%',
      background,
      borderRadius: '4px',
    })}
    direction="vertical"
    gap={2}
  >
    <Text css={css({ paddingX: 6, paddingTop: 6, fontWeight: 'medium' })}>
      {title}
    </Text>
    <Stack
      as="ul"
      css={css({
        margin: 0,
        padding: 2,
        width: '100%',
        listStyle: 'none',
      })}
      direction="vertical"
      gap={1}
    >
      {features.map(feature => (
        <Stack
          key={feature.key}
          as="li"
          css={css({
            paddingX: 4,
            paddingY: 2,
            width: '100%',
          })}
          align="center"
          justify="space-between"
          gap={3}
        >
          <Text size={3}>{feature.label}</Text>

          {feature.pill && (
            <Text
              css={css({
                color: 'black',
                background: '#EDFFA5',
                padding: '1px 6px 0px',
                borderRadius: 100,
                fontWeight: 'medium',
              })}
              size={2}
            >
              {feature.pill}
            </Text>
          )}
        </Stack>
      ))}
    </Stack>
  </Stack>
);
