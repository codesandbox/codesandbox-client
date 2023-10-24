import React from 'react';
import {
  Element,
  Stack,
  Text,
  SkeletonText,
  Badge,
} from '@codesandbox/components';
import track from '@codesandbox/common/lib/utils/analytics';
import { useAppState, useActions } from 'app/overmind';
import { Step } from 'app/overmind/namespaces/pro/types';
import { SubscriptionInterval } from 'app/graphql/types';
import { useWorkspaceSubscription } from 'app/hooks/useWorkspaceSubscription';
import { useWorkspaceAuthorization } from 'app/hooks/useWorkspaceAuthorization';
import { formatCurrency } from 'app/utils/currency';
import {
  TEAM_PRO_FEATURES,
  ORG_FEATURES,
  ORGANIZATION_CONTACT_LINK,
} from 'app/constants';
import { SubscriptionCard } from '../components/SubscriptionCard';
import type { CTA } from '../components/SubscriptionCard';
import { StyledPricingDetailsText } from '../components/elements';

// TODO: Rename
export const WorkspacePlanSelection: React.FC = () => {
  const { activeTeam, activeTeamInfo, dashboard } = useAppState();
  const {
    pro: { setStep },
  } = useActions();

  const { isBillingManager } = useWorkspaceAuthorization();
  // const isBillingManager = true; // DEBUG
  const { subscription, isPro, isFree } = useWorkspaceSubscription();

  // Q: Does this ever occur with the checks in /pro/index.tsx and Legacy.tsx?
  // A: It doesn't ever occur because before this component is rendered we check for
  // isPaddle or isPatron which are part of activeTeam. However, we can't guarantee
  // that this comopnent will only be used there so we will keep this check for now.
  if (!activeTeam || !dashboard.teams.length) return null;

  const teamProCta: CTA =
    // eslint-disable-next-line no-nested-ternary
    isBillingManager
      ? // Only allowed to change from monthly to yearly
        subscription.billingInterval === SubscriptionInterval.Monthly
        ? {
            text: 'Change to yearly billing',
            onClick: () => {
              track('legacy subscription page - change to yearly billing', {
                codesandbox: 'V1',
                event_source: 'UI',
              });

              setStep(Step.ConfirmBillingInterval);
            },
            variant: 'light',
          }
        : {
            text: 'Contact support',
            href: 'mailto:support@codesandbox.io',
            variant: 'light',
            onClick: () => {
              track('legacy subscription page - contact support', {
                codesandbox: 'V1',
                event_source: 'UI',
              });
            },
          }
      : undefined;

  const isYearlyInterval =
    subscription.billingInterval === SubscriptionInterval.Yearly;

  const getPrice = (options?: { perEditor?: boolean }) => {
    if (!subscription) {
      return null;
    }

    const multiplier = isYearlyInterval ? 12 : 1;
    const quantity = options?.perEditor ? 1 : subscription.quantity;
    const price = quantity * subscription.unitPrice * multiplier;

    // A Paddle subscription returns the currency in uppercase EUR. A Stripe
    // subscription returns the currency in lowercase usd. The formatCurrency
    // function expects the currency in uppercase.
    const currency = subscription.currency?.toUpperCase() || 'USD';

    // The formatCurrency function will divide the price by 100 to make sure
    // the cents are converted to full currency.
    return formatCurrency({
      currency,
      amount: price,
    });
  };

  return (
    <div>
      <Stack gap={10} direction="vertical">
        <Stack gap={3} direction="vertical" align="center">
          <Stack gap={2} direction="horizontal" align="center">
            <Text size={24}>{activeTeamInfo.name}</Text>
            {isPro && <Badge variant="pro">Pro</Badge>}
          </Stack>

          <Element css={{ maxWidth: '976px', textAlign: 'center' }}>
            <Text
              as="h1"
              fontFamily="everett"
              size={48}
              weight="500"
              align="center"
              lineHeight="56px"
              margin={0}
            >
              {isPro ? 'You have an active Pro subscription' : null}
              {isFree ? 'Upgrade for Pro features' : null}
            </Text>
          </Element>
        </Stack>
        <Stack
          gap={2}
          justify="center"
          css={{
            // The only way to change the stack styles responsively
            // with CSS rules only.
            '@media (max-width: 888px)': {
              flexDirection: 'column',
              alignItems: 'center',
              '& > *:not(:last-child)': {
                marginRight: 0,
                marginBottom: '8px',
              },
            },
          }}
        >
          <SubscriptionCard
            title="Pro"
            features={TEAM_PRO_FEATURES}
            cta={teamProCta}
            isHighlighted
          >
            <Stack gap={1} direction="vertical">
              <Text size={32} weight="500">
                {subscription ? (
                  getPrice({ perEditor: true })
                ) : (
                  <SkeletonText css={{ width: '60px', height: '40px' }} />
                )}
              </Text>
              <Text>
                <div>per editor{isBillingManager ? ',' : null}</div>
                {isBillingManager ? (
                  <div>
                    a total of{' '}
                    {subscription ? (
                      getPrice()
                    ) : (
                      <SkeletonText
                        css={{
                          display: 'inline-block',
                          marginBottom: '-4px',
                          width: '20px',
                        }}
                      />
                    )}{' '}
                    will be billed each {isYearlyInterval ? 'year' : 'month'}
                  </div>
                ) : null}
              </Text>
            </Stack>
          </SubscriptionCard>

          <SubscriptionCard
            title="Organization"
            features={ORG_FEATURES}
            cta={{
              text: 'Contact us',
              href: ORGANIZATION_CONTACT_LINK,
              variant: 'dark',
              onClick: () => {
                track('subscription page - contact us', {
                  codesandbox: 'V1',
                  event_source: 'UI',
                });
              },
            }}
          >
            <Stack gap={1} direction="vertical">
              <Text size={32} weight="400">
                Custom
              </Text>
              <StyledPricingDetailsText>
                <div>tailor-made plan.</div>
                <div>bulk pricing for seats.</div>
              </StyledPricingDetailsText>
            </Stack>
          </SubscriptionCard>
        </Stack>
      </Stack>
    </div>
  );
};
