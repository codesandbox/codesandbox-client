import React, { ButtonHTMLAttributes } from 'react';
import { format } from 'date-fns';
import { sortBy } from 'lodash-es';
import { useLocation } from 'react-router-dom';
import { VisuallyHidden } from 'reakit/VisuallyHidden';
import { Stack, Text } from '@codesandbox/components';
// TODO: Tracking
// import track from '@codesandbox/common/lib/utils/analytics';
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

/**
 * TODO: Update with actual subscription instead of selected plan
 */
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

type CancelButtonProps = {
  children: string;
  onClick: ButtonHTMLAttributes<HTMLButtonElement>['onClick'];
};

const CancelButton = ({ children, onClick }: CancelButtonProps) => (
  <Text
    as="button"
    variant="danger"
    onClick={onClick}
    css={{
      display: 'block',
      margin: '0 auto',
      border: 'none',
      padding: 0,
      background: 'transparent',
      '&:hover': {
        textDecoration: 'underline',
      },
    }}
  >
    {children}
  </Text>
);

export const WorkspacePlanSelection: React.FC = () => {
  const {
    personalWorkspaceId,
    user,
    activeTeam,
    activeTeamInfo,
    dashboard,
  } = useAppState();
  const {
    setActiveTeam,
    modalOpened,
    pro: { setStep },
    patron: { cancelSubscriptionClicked },
  } = useActions();

  const location = useLocation();
  const { isPersonalSpace, isTeamAdmin } = useWorkspaceAuthorization();
  // const isPersonalSpace = false; // DEBUG
  // const isTeamAdmin = true; // DEBUG
  const { subscription } = useWorkspaceSubscription();

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

  // TODO: Does this ever occur with the checks in /pro/index.tsx and Legacy.tsx?
  if (!activeTeam || !dashboard.teams.length) return null;

  const currentSubscription = activeTeamInfo?.subscription;

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

  const personalProCta: React.ComponentProps<typeof SubscriptionCard>['cta'] = {
    text: 'Manage subscription',
    onClick: () => {
      modalOpened({ modal: 'legacyPayment' });
    },
    variant: 'light',
  };

  // TODO: Since all the subscription management was based on creating a new subscription
  // we will probably remove most of the CTAs and replace them with just "Contact suport".
  const teamProCta: React.ComponentProps<
    typeof SubscriptionCard
    // eslint-disable-next-line no-nested-ternary
  >['cta'] = isTeamAdmin
    ? // Only allowed to change from monthly to yearly
      currentSubscription.billingInterval === SubscriptionInterval.Monthly
      ? {
          text: 'Update billing interval',
          onClick: () => {
            setStep(Step.ConfirmBillingInterval);
          },
          variant: 'light',
        }
      : {
          text: 'Contact support',
          href: 'mailto:support@codesandbox.io',
          variant: 'light',
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
            <Stack gap={1} direction="vertical" css={{ flexGrow: 1 }}>
              <Text aria-hidden size={32} weight="400">
                $0
              </Text>
              <VisuallyHidden>Zero dollar</VisuallyHidden>
              <Text>forever</Text>
            </Stack>
          </SubscriptionCard>

          {isPersonalSpace ? (
            <SubscriptionCard
              title={
                user.subscription.plan === 'patron' ? 'Patron' : 'Personal Pro'
              }
              features={PERSONAL_FEATURES}
              cta={personalProCta}
              isHighlighted
            >
              <Stack gap={1} direction="vertical">
                <Text size={32} weight="500">
                  ${user.subscription.amount}
                </Text>
                {user.subscription.duration === 'yearly' ? (
                  <Text>
                    charged annually on{' '}
                    {format(new Date(user.subscription.since), 'MMM dd')}
                  </Text>
                ) : (
                  <Text>
                    charged on the{' '}
                    {format(new Date(user.subscription.since), 'do')} of each
                    month
                  </Text>
                )}
              </Stack>
            </SubscriptionCard>
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

        {isPersonalSpace ? (
          <CancelButton onClick={cancelSubscriptionClicked}>
            cancel your subscription
          </CancelButton>
        ) : null}
      </Stack>
    </div>
  );
};
