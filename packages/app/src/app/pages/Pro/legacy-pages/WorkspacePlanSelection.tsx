import React from 'react';
import { format } from 'date-fns';
import { sortBy } from 'lodash-es';
import { useLocation } from 'react-router-dom';
import { VisuallyHidden } from 'reakit/VisuallyHidden';
import { Stack, Text } from '@codesandbox/components';
import track from '@codesandbox/common/lib/utils/analytics';
import { useAppState, useActions } from 'app/overmind';
import { Step } from 'app/overmind/namespaces/pro/types';
import { SubscriptionType, SubscriptionInterval } from 'app/graphql/types';
import { useWorkspaceSubscription } from 'app/hooks/useWorkspaceSubscription';
import { useWorkspaceAuthorization } from 'app/hooks/useWorkspaceAuthorization';
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

const getBillingText = ({
  quantity,
  unitPrice,
  billingInterval,
}: {
  quantity: number;
  unitPrice: number;
  billingInterval: SubscriptionInterval;
}) => {
  const isMonthly = billingInterval === SubscriptionInterval.Monthly;
  const multiplier = isMonthly ? 1 : 12;
  const price = quantity * unitPrice * multiplier;

  return `a total of $${price} will be billed each ${
    isMonthly ? 'month' : 'year'
  }`;
};

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
  const { isPersonalSpace, isTeamAdmin } = useWorkspaceAuthorization();
  // const isPersonalSpace = false; // DEBUG
  // const isTeamAdmin = true; // DEBUG
  const { subscription, isPatron } = useWorkspaceSubscription();

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
    isTeamAdmin
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

          <Text
            as="h1"
            fontFamily="everett"
            size={48}
            weight="500"
            align="center"
            lineHeight="56px"
            margin={0}
          >
            You have an active Pro subscription.
          </Text>
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
                features={PERSONAL_FEATURES}
                cta={personalProCta}
                isHighlighted
              >
                <Stack gap={1} direction="vertical">
                  <Text size={32} weight="500">
                    {`${subscription.currency || '$'}${subscription.unitPrice}`}
                  </Text>
                  {subscription.billingInterval ===
                  SubscriptionInterval.Yearly ? (
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
              features={TEAM_PRO_FEATURES}
              cta={teamProCta}
              isHighlighted
            >
              <Stack gap={1} direction="vertical">
                <Text size={32} weight="500">
                  ${subscription.unitPrice}
                </Text>
                <Text>
                  <div>per editor</div>
                  {isTeamAdmin ? (
                    <div>
                      {getBillingText({
                        quantity: subscription.quantity,
                        unitPrice: subscription.unitPrice,
                        billingInterval: subscription.billingInterval,
                      })}
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
