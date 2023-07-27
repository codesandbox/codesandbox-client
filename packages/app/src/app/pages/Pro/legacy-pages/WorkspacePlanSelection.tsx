import React from 'react';
import { format } from 'date-fns';
import { sortBy } from 'lodash-es';
import { useLocation } from 'react-router-dom';
import { VisuallyHidden } from 'reakit/VisuallyHidden';
import { Element, Stack, Text, SkeletonText } from '@codesandbox/components';
import track from '@codesandbox/common/lib/utils/analytics';
import { useAppState, useActions } from 'app/overmind';
import { Step } from 'app/overmind/namespaces/pro/types';
import { SubscriptionType, SubscriptionInterval } from 'app/graphql/types';
import { useWorkspaceSubscription } from 'app/hooks/useWorkspaceSubscription';
import { useWorkspaceAuthorization } from 'app/hooks/useWorkspaceAuthorization';
import { formatCurrency } from 'app/utils/currency';
import {
  PERSONAL_FREE_FEATURES,
  PERSONAL_FEATURES,
  TEAM_FREE_FEATURES,
  TEAM_PRO_FEATURES,
} from 'app/constants';
import { Switcher } from '../components/Switcher';
import { SubscriptionCard } from '../components/SubscriptionCard';
import type { CTA } from '../components/SubscriptionCard';
import { StyledPricingDetailsText } from '../components/elements';
import { UpsellTeamProCard } from '../components/UpsellTeamProCard';

// TODO: Rename
export const WorkspacePlanSelection: React.FC = () => {
  const {
    personalWorkspaceId,
    activeTeam,
    activeTeamInfo,
    dashboard,
  } = useAppState();
  const {
    setActiveTeam,
    modalOpened,
    pro: { setStep },
  } = useActions();

  const location = useLocation();
  const {
    isPersonalSpace,
    isTeamSpace,
    isBillingManager,
  } = useWorkspaceAuthorization();
  // const isPersonalSpace = false; // DEBUG
  // const isBillingManager = true; // DEBUG
  const { subscription, isPatron, isPro, isFree } = useWorkspaceSubscription();

  // Based on the 'type' search param we redirect to the personal pro page if
  // it's not yet active.
  const searchParams = new URLSearchParams(location.search);
  const subTypeParam = searchParams.get('type') as SubscriptionType | null;

  React.useEffect(
    function switchToPersonalWorkspaceBasedOnParam() {
      if (!isPersonalSpace && subTypeParam === SubscriptionType.PersonalPro) {
        setActiveTeam({ id: personalWorkspaceId });
      }
    },
    [isPersonalSpace, subTypeParam, setActiveTeam, personalWorkspaceId]
  );

  // Q: Does this ever occur with the checks in /pro/index.tsx and Legacy.tsx?
  // A: It doesn't ever occur because before this component is rendered we check for
  // isPaddle or isPatron which are part of activeTeam. However, we can't guarantee
  // that this comopnent will only be used there so we will keep this check for now.
  if (!activeTeam || !dashboard.teams.length) return null;

  const personalWorkspace = dashboard.teams.find(
    t => t.id === personalWorkspaceId
  )!;

  const workspacesList = [
    personalWorkspace,
    ...sortBy(
      dashboard.teams.filter(team => team.id !== personalWorkspaceId),
      team => team.name.toLowerCase()
    ),
  ];

  const personalProCta: CTA = {
    text: 'Manage subscription',
    onClick: () => {
      modalOpened({ modal: 'legacyPayment' });
    },
    variant: 'light',
  };

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
          <Switcher
            workspaces={workspacesList}
            setActiveTeam={setActiveTeam}
            personalWorkspaceId={personalWorkspaceId}
            activeTeamInfo={activeTeamInfo}
          />

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
              {isPro && isPersonalSpace
                ? 'You have an active Personal Pro subscription'
                : null}
              {isPro && isTeamSpace
                ? 'You have an active Team Pro subscription'
                : null}
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
            title="Free plan"
            subTitle="1 editor only"
            features={
              isPersonalSpace ? PERSONAL_FREE_FEATURES : TEAM_FREE_FEATURES
            }
          >
            <Stack gap={1} direction="vertical">
              <Text aria-hidden size={32} weight="400">
                $0
              </Text>
              <VisuallyHidden>Zero dollar</VisuallyHidden>
              <StyledPricingDetailsText>forever</StyledPricingDetailsText>
            </Stack>
          </SubscriptionCard>

          {isPersonalSpace ? (
            <>
              <SubscriptionCard
                title={isPatron ? 'Patron' : 'Personal Pro'}
                subTitle="1 editor only"
                features={PERSONAL_FEATURES}
                cta={personalProCta}
                isHighlighted
              >
                <Stack gap={1} direction="vertical">
                  <Text size={32} weight="500">
                    {subscription ? (
                      getPrice()
                    ) : (
                      <SkeletonText css={{ width: '60px', height: '40px' }} />
                    )}
                  </Text>
                  {isYearlyInterval ? (
                    <StyledPricingDetailsText>
                      charged annually on{' '}
                      {format(new Date(subscription.nextBillDate), 'MMM dd')}
                    </StyledPricingDetailsText>
                  ) : (
                    <StyledPricingDetailsText>
                      charged on the{' '}
                      {format(new Date(subscription.nextBillDate), 'do')} of
                      each month
                    </StyledPricingDetailsText>
                  )}
                </Stack>
              </SubscriptionCard>
              <UpsellTeamProCard trackingLocation="legacy subscription page" />
            </>
          ) : (
            <SubscriptionCard
              title="Team Pro"
              subTitle="Up to 20 editors"
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
          )}
        </Stack>
      </Stack>
    </div>
  );
};
