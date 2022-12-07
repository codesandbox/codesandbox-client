import React from 'react';
import { format } from 'date-fns';
import { sortBy } from 'lodash-es';
import { useLocation } from 'react-router-dom';
import { VisuallyHidden } from 'reakit/VisuallyHidden';
import css from '@styled-system/css';
import { Stack, Element, Text, Button, Link } from '@codesandbox/components';
import track from '@codesandbox/common/lib/utils/analytics';
import { useAppState, useActions } from 'app/overmind';
import { Step, Plan } from 'app/overmind/namespaces/pro/types';
import {
  TeamMemberAuthorization,
  SubscriptionType,
  SubscriptionInterval,
} from 'app/graphql/types';
import { useWorkspaceSubscription } from 'app/hooks/useWorkspaceSubscription';
import { useWorkspaceAuthorization } from 'app/hooks/useWorkspaceAuthorization';
import {
  PERSONAL_FREE_FEATURES,
  PERSONAL_FEATURES,
  TEAM_FREE_FEATURES,
  TEAM_PRO_FEATURES,
} from 'app/constants';
import { plans } from './plans';
import { Switcher } from '../components/Switcher';
import { SubscriptionCard } from '../components/SubscriptionCard';

// https://www.notion.so/codesandbox-app/Sunset-Paddle-7087eb6c04b34c729dad3b41fd4517eb

const getBillingPerSeatText = (
  numberOfSeats: number,
  { currency, unit, multiplier, billingInterval }: Plan
) => {
  const price = numberOfSeats * unit * multiplier;
  const isMonthly = billingInterval === SubscriptionInterval.Monthly;

  return `a total of ${currency}${price} will be billed each ${
    isMonthly ? 'month' : 'year'
  }`;
};

export const WorkspacePlanSelection: React.FC<{
  loading: boolean;
}> = ({ loading }) => {
  const {
    personalWorkspaceId,
    user,
    activeTeam,
    activeTeamInfo,
    dashboard,
    pro: { selectedPlan },
  } = useAppState();
  const {
    setActiveTeam,
    modalOpened,
    pro: { setStep, updateSelectedPlan },
    patron: { cancelSubscriptionClicked },
  } = useActions();

  const location = useLocation();
  // const { isPersonalSpace, isTeamAdmin } = useWorkspaceAuthorization();
  const isPersonalSpace = false; // DEBUG
  const isTeamAdmin = true; // DEBUG
  const { numberOfSeats } = useWorkspaceSubscription();

  const searchParams = new URLSearchParams(location.search);
  const type = searchParams.get('type') as SubscriptionType | null;
  const interval = searchParams.get('interval') as SubscriptionInterval | null;
  const billingInterval = interval || SubscriptionInterval.Monthly;

  React.useEffect(
    // TODO: can we remove this?
    function setPlan() {
      let newPlan: typeof plans[keyof typeof plans];
      if (isPersonalSpace) {
        if (billingInterval === SubscriptionInterval.Yearly) {
          newPlan = plans.PERSONAL_PRO_ANNUAL;
        } else {
          newPlan = plans.PERSONAL_PRO_MONTHLY;
        }
      } else if (billingInterval === SubscriptionInterval.Yearly) {
        newPlan = plans.TEAM_PRO_ANNUAL;
      } else {
        newPlan = plans.TEAM_PRO_MONTHLY;
      }

      updateSelectedPlan(newPlan);
    },
    [isPersonalSpace, billingInterval, updateSelectedPlan]
  );

  React.useEffect(
    // TODO: Remove this and replace it with not having CTAs
    function switchToWorkspaceWithAdminRights() {
      // if type is PERSONAL_PRO, switch to personal account
      if (type === SubscriptionType.PersonalPro) {
        setActiveTeam({ id: personalWorkspaceId });
        return;
      }

      // if you land on an account where you are not the admin
      // switch accounts to one where you are an admin
      // if none, switch to personal account
      if (!isTeamAdmin && dashboard.teams.length) {
        const workspaceWithAdminRights = dashboard.teams.find(
          team => team.id !== personalWorkspaceId && isTeamAdmin
        );

        if (workspaceWithAdminRights) {
          setActiveTeam({ id: workspaceWithAdminRights.id });
        } else {
          setActiveTeam({ id: personalWorkspaceId });
        }
      }
    },
    [isTeamAdmin, type, dashboard.teams, setActiveTeam, personalWorkspaceId]
  );

  // does this ever occur with the checks in /pro/index.tsx and Legacy.tsx?
  if (!activeTeam || !dashboard.teams.length || !selectedPlan) return null;

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
                // TODO: clean this up?
                user.subscription.plan === 'patron' ? 'Patron' : 'Personal Pro'
              }
              features={PERSONAL_FEATURES}
              isHighlighted
            >
              <Stack gap={1} direction="vertical">
                <Text size={32} weight="500">
                  {selectedPlan.currency}
                  {selectedPlan.unit}
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
              isHighlighted
            >
              <Stack gap={1} direction="vertical">
                <Text size={32} weight="500">
                  {selectedPlan.currency}
                  {selectedPlan.unit}
                </Text>
                <Text>
                  <div>per editor</div>
                  {isTeamAdmin ? (
                    <div>
                      {getBillingPerSeatText(numberOfSeats, selectedPlan)}
                    </div>
                  ) : null}
                </Text>
              </Stack>
            </SubscriptionCard>
          )}
        </Stack>
      </Stack>

      <Element padding={100} />

      {isPersonalSpace ? (
        <Stack direction="vertical" gap={4}>
          <Stack
            direction="vertical"
            gap={1}
            css={css({
              padding: 4,
              border: '1px solid',
              borderColor: 'grays.500',
              borderRadius: 'small',
              overflow: 'hidden',
            })}
          >
            <Text size={3}>Current plan</Text>
            <Text variant="muted">
              {user.subscription.plan === 'patron' ? 'Patron' : 'Personal Pro'}
            </Text>
            <Text variant="muted">
              You will be billed{' '}
              {user.subscription.duration === 'yearly' ? (
                <>
                  and charged annually on{' '}
                  {format(new Date(user.subscription.since), 'MMM dd')}.
                </>
              ) : (
                <>
                  on the {format(new Date(user.subscription.since), 'do')} of
                  each month.
                </>
              )}
            </Text>
          </Stack>

          <Text variant="muted">
            You can{' '}
            <Link
              variant="active"
              onClick={e => {
                e.preventDefault();

                modalOpened({ modal: 'legacyPayment' });
              }}
            >
              update your payment details
            </Link>{' '}
            or{' '}
            <Link
              variant="active"
              onClick={e => {
                e.preventDefault();
                cancelSubscriptionClicked();
              }}
            >
              cancel your subscription.
            </Link>
          </Text>
        </Stack>
      ) : (
        <Stack direction="vertical" gap={6}>
          {currentSubscription ? (
            <>
              <Button
                loading={loading}
                disabled={
                  // non-admins can't upgrade
                  !isTeamAdmin ||
                  // you are not allowed to change from yearly to monthly
                  currentSubscription.billingInterval ===
                    SubscriptionInterval.Yearly ||
                  // if it's already the same, then nothing to do here
                  selectedPlan.billingInterval ===
                    currentSubscription.billingInterval
                }
                onClick={() => setStep(Step.ConfirmBillingInterval)}
                css={css({
                  fontSize: 3,
                  height: 10,
                  fontWeight: 700,
                })}
              >
                Update billing interval
              </Button>
              {currentSubscription.billingInterval ===
                SubscriptionInterval.Yearly &&
              selectedPlan.billingInterval === SubscriptionInterval.Monthly ? (
                <Text align="center">
                  Changing billing interval from Yearly to Monthly is not
                  supported yet. Please email us at support@codesandbox.io
                </Text>
              ) : null}
            </>
          ) : null}
        </Stack>
      )}
    </div>
  );
};
