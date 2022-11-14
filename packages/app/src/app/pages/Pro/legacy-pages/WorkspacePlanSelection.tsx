import React from 'react';
import { format } from 'date-fns';
import { sortBy } from 'lodash-es';
import { useLocation } from 'react-router-dom';
import { Stack, Text, Menu, Icon, Button, Link } from '@codesandbox/components';
import css from '@styled-system/css';
import { useAppState, useActions } from 'app/overmind';
import { Step, Plan } from 'app/overmind/namespaces/pro/types';
import { TeamAvatar } from 'app/components/TeamAvatar';
import {
  TeamMemberAuthorization,
  ProSubscription,
  SubscriptionType,
  SubscriptionInterval,
} from 'app/graphql/types';
import track from '@codesandbox/common/lib/utils/analytics';
import { plans } from './plans';

const prettyPermissions = {
  ADMIN: 'Admin',
  WRITE: 'Editor',
  READ: 'Viewer',
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
    pro: { setStep, updateSelectedPlan, updateSeats },
    patron: { cancelSubscriptionClicked },
    openCreateTeamModal,
  } = useActions();

  const location = useLocation();

  const searchParams = new URLSearchParams(location.search);
  const type = searchParams.get('type') as SubscriptionType;
  const interval = searchParams.get('interval') as SubscriptionInterval;

  const [billingInterval, setBillingInterval] = React.useState<
    Plan['billingInterval']
  >(interval || SubscriptionInterval.Monthly);

  const isPersonalWorkspace = personalWorkspaceId === activeTeam;

  React.useEffect(
    function setPlan() {
      let newPlan: typeof plans[keyof typeof plans];
      if (isPersonalWorkspace) {
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
    [isPersonalWorkspace, billingInterval, updateSelectedPlan]
  );

  const personalWorkspace = dashboard.teams.find(
    t => t.id === personalWorkspaceId
  )!;

  const getUserAuthorization = React.useCallback(
    workspace => {
      const userAuthorization = workspace.userAuthorizations.find(
        authorization => authorization.userId === user.id
      ).authorization;
      return userAuthorization;
    },
    [user]
  );

  const workspaces = [
    personalWorkspace,
    ...sortBy(
      dashboard.teams.filter(t => t.id !== personalWorkspaceId),
      [getUserAuthorization, 'name']
    ),
  ].filter(exists => exists);

  const activeWorkspace = workspaces.find(
    workspace => workspace.id === activeTeam
  );
  const activeUserAuthorization =
    activeWorkspace && getUserAuthorization(activeWorkspace);

  React.useEffect(
    function switchToWorkspaceWithAdminRights() {
      // if type is PERSONAL_PRO, switch to personal account
      if (type === SubscriptionType.PersonalPro) {
        setActiveTeam({ id: personalWorkspaceId });
        return;
      }

      // if you land on an account where you are not the admin
      // switch accounts to one where you are an admin
      // if none, switch to personal account
      if (
        activeUserAuthorization !== TeamMemberAuthorization.Admin &&
        dashboard.teams.length
      ) {
        const workspaceWithAdminRights = dashboard.teams.find(
          team =>
            team.id !== personalWorkspaceId &&
            getUserAuthorization(team) === TeamMemberAuthorization.Admin
        );

        if (workspaceWithAdminRights) {
          setActiveTeam({ id: workspaceWithAdminRights.id });
        } else {
          setActiveTeam({ id: personalWorkspaceId });
        }
      }
    },
    [
      type,
      activeUserAuthorization,
      dashboard.teams,
      setActiveTeam,
      personalWorkspaceId,
      getUserAuthorization,
    ]
  );

  React.useEffect(
    function trackingPlanChoice() {
      track('Pro - Set billing interval', { billingInterval });
    },
    [billingInterval]
  );

  React.useEffect(
    function trackingWorkspace() {
      track('Pro - Change Team selection');
    },
    [activeWorkspace]
  );

  if (!activeTeam || !dashboard.teams.length || !selectedPlan) return null;

  const numberOfEditors = activeWorkspace.userAuthorizations.filter(
    ({ authorization }) => authorization !== TeamMemberAuthorization.Read
  ).length;
  updateSeats(numberOfEditors);

  const isLegacyPersonalPro = isPersonalWorkspace && user.subscription;
  const currentSubscription = activeTeamInfo?.subscription;

  // if there is mismatch of intent - team/personal
  // or you don't have access to upgrade
  // open the account switcher on load
  const switcherDefaultOpen =
    (type === SubscriptionType.TeamPro && isPersonalWorkspace) ||
    activeUserAuthorization !== TeamMemberAuthorization.Admin;

  return (
    <div style={{ width: '100%' }}>
      <Text
        size={7}
        as="h1"
        block
        weight="bold"
        align="center"
        marginBottom={4}
      >
        Upgrade to Pro
      </Text>
      <Text
        size={3}
        variant="muted"
        block
        align="center"
        marginBottom={8}
        css={{ maxWidth: 560 }}
      >
        Join our community of creators from {selectedPlan.currency}
        {selectedPlan.unit}/month.
        <br /> Cancel at any time, effective at the end of the payment period.
      </Text>
      <Stack direction="vertical" gap={1} marginBottom={6}>
        <Text>Account</Text>
        <Stack
          css={css({
            button: {
              border: '1px solid',
              borderColor: 'grays.500',
              borderRadius: 'small',
              paddingY: 1,
              img: { size: 6 },
              span: { fontSize: 3, maxWidth: 'calc(100% - 16px)' },
            },
          })}
        >
          <Menu defaultOpen={switcherDefaultOpen}>
            <Stack
              as={Menu.Button}
              justify="space-between"
              align="center"
              css={css({
                width: '100%',
                height: '100%',
                paddingLeft: 2,
                borderRadius: 0,
                '&:hover': {
                  backgroundColor: 'grays.600',
                },
              })}
            >
              <Stack gap={2} as="span" align="center">
                <Stack as="span" align="center" justify="center">
                  <TeamAvatar
                    avatar={activeWorkspace.avatarUrl}
                    name={activeWorkspace.name}
                  />
                </Stack>
                <Text size={4} weight="normal" maxWidth={140}>
                  {activeWorkspace.name}
                </Text>
              </Stack>
              <Icon name="caret" size={8} />
            </Stack>
            <Menu.List
              css={css({
                width: '560px',
                marginTop: '-4px',
                backgroundColor: 'grays.600',
              })}
              style={{ backgroundColor: '#242424', borderColor: '#343434' }} // TODO: find a way to override reach styles without the selector mess
            >
              {workspaces.map(workspace => {
                const userAuthorization = getUserAuthorization(workspace);

                return (
                  <Stack
                    as={Menu.Item}
                    key={workspace.id}
                    justify="space-between"
                    align="center"
                    css={css({
                      height: 10,
                      textAlign: 'left',
                      backgroundColor: 'grays.600',
                      borderBottom: '1px solid',
                      borderColor: 'grays.500',
                      '&[data-reach-menu-item][data-component=MenuItem][data-selected]': {
                        backgroundColor: 'grays.500',
                      },
                    })}
                    style={{ paddingLeft: 8 }}
                    data-disabled={
                      userAuthorization !== TeamMemberAuthorization.Admin
                        ? true
                        : null
                    }
                    onSelect={event => {
                      if (userAuthorization === TeamMemberAuthorization.Admin) {
                        setActiveTeam({ id: workspace.id });
                      } else event.preventDefault();
                    }}
                  >
                    <Stack gap={2} align="center" css={{ width: '100%' }}>
                      <TeamAvatar
                        avatar={workspace.avatarUrl}
                        name={workspace.name}
                        size="small"
                      />
                      <Text size={3} maxWidth="100%">
                        {workspace.name}
                      </Text>
                    </Stack>

                    {activeWorkspace.id === workspace.id && (
                      <Icon name="simpleCheck" />
                    )}

                    {userAuthorization !== TeamMemberAuthorization.Admin &&
                      prettyPermissions[userAuthorization]}
                  </Stack>
                );
              })}
              <Stack
                as={Menu.Item}
                align="center"
                gap={2}
                css={css({ height: 10, textAlign: 'left' })}
                style={{ paddingLeft: 8 }}
                onSelect={openCreateTeamModal}
              >
                <Stack
                  justify="center"
                  align="center"
                  css={css({
                    size: 6,
                    borderRadius: 'small',
                    border: '1px solid',
                    borderColor: 'grays.500',
                  })}
                >
                  <Icon name="plus" size={10} />
                </Stack>
                <Text size={3}>Create a new team</Text>
              </Stack>
            </Menu.List>
          </Menu>
        </Stack>
      </Stack>

      {isLegacyPersonalPro ? (
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
          <Stack gap={7}>
            {isPersonalWorkspace ? (
              <>
                <PlanCard
                  plan={plans.PERSONAL_PRO_MONTHLY}
                  billingInterval={billingInterval}
                  setBillingInterval={setBillingInterval}
                  currentSubscription={currentSubscription}
                />
                <PlanCard
                  plan={plans.PERSONAL_PRO_ANNUAL}
                  billingInterval={billingInterval}
                  setBillingInterval={setBillingInterval}
                  currentSubscription={currentSubscription}
                />
              </>
            ) : (
              <>
                <PlanCard
                  plan={plans.TEAM_PRO_MONTHLY}
                  billingInterval={billingInterval}
                  setBillingInterval={setBillingInterval}
                  currentSubscription={currentSubscription}
                />
                <PlanCard
                  plan={plans.TEAM_PRO_ANNUAL}
                  billingInterval={billingInterval}
                  setBillingInterval={setBillingInterval}
                  currentSubscription={currentSubscription}
                />
              </>
            )}
          </Stack>

          <Stack
            direction="vertical"
            gap={1}
            css={css({
              padding: 4,
              border: '1px solid',
              borderColor: 'grays.500',
              borderRadius: 'small',
              overflow: 'hidden',
              button: {
                fontSize: 3,
                height: 10,
                fontFamily: 'Lato, sans-serif',
                fontWeight: 700,
              },
            })}
          >
            <Text size={3}>Team editors</Text>
            <Stack justify="space-between">
              <Stack direction="vertical" gap={4}>
                <Text variant="muted" size={3}>
                  {numberOfEditors} {numberOfEditors === 1 ? 'seat' : 'seats'}
                  <Text size={2}> ✕ </Text> {selectedPlan.currency}
                  {selectedPlan.unit}{' '}
                  {selectedPlan.multiplier > 1 ? (
                    <>
                      <Text size={2}> ✕</Text> {selectedPlan.multiplier}
                    </>
                  ) : null}
                </Text>
                <Text variant="muted">
                  Prices listed in USD. Taxes may apply.
                </Text>
              </Stack>
              <Text weight="bold" size={4}>
                {selectedPlan.currency}
                {numberOfEditors *
                  selectedPlan.unit *
                  selectedPlan.multiplier}{' '}
                /{' '}
                {selectedPlan.billingInterval === SubscriptionInterval.Monthly
                  ? 'month'
                  : 'year'}
              </Text>
            </Stack>
          </Stack>

          {currentSubscription ? (
            <>
              <Button
                loading={loading}
                disabled={
                  // non-admins can't upgrade
                  activeUserAuthorization !== TeamMemberAuthorization.Admin ||
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
                  fontFamily: 'Lato, sans-serif',
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
          ) : (
            <Button
              loading={loading}
              disabled={
                // non-admins can't upgrade
                activeUserAuthorization !== TeamMemberAuthorization.Admin
              }
              onClick={() => setStep(Step.InlineCheckout)}
              css={css({
                fontSize: 3,
                height: 10,
                fontFamily: 'Lato, sans-serif',
                fontWeight: 700,
              })}
            >
              Continue
            </Button>
          )}
        </Stack>
      )}
    </div>
  );
};

const PlanCard: React.FC<{
  plan: Plan;
  billingInterval: Plan['billingInterval'];
  setBillingInterval: (billingInterval: Plan['billingInterval']) => void;
  // Omitting new trialEnd and trialStart
  currentSubscription: Omit<
    ProSubscription,
    'trialEnd' | 'trialStart' | 'cancelAtPeriodEnd' | 'active'
  > | null;
}> = ({ plan, billingInterval, setBillingInterval, currentSubscription }) => {
  const isSelected = plan.billingInterval === billingInterval;
  const isCurrent =
    plan.billingInterval === currentSubscription?.billingInterval;

  return (
    <Stack
      as="label"
      direction="vertical"
      css={css({
        flexGrow: 1,
        padding: 4,
        border: '1px solid',
        borderRadius: 'small',
        borderColor: isSelected ? 'blues.600' : 'grays.600',
        backgroundColor: isSelected ? 'blues.900' : 'transparent',
        transition: 'borderColor, backgroundColor',
        transitionDuration: theme => theme.speeds[3],
      })}
    >
      <Stack justify="space-between" align="center">
        <Stack direction="vertical" gap={1}>
          <Text size={4} weight="bold">
            {plan.billingInterval === SubscriptionInterval.Yearly
              ? 'Annual'
              : 'Monthly'}
            {isCurrent ? ' (Current)' : null}
          </Text>
          <Text size={3}>{plan.name}</Text>
          <Text size={3} variant="muted">
            {plan.currency}
            {plan.unit}{' '}
            {plan.type === SubscriptionType.TeamPro ? 'per editor' : null} per
            month
          </Text>
        </Stack>
        <div>
          <input
            type="radio"
            hidden
            checked={isSelected}
            onChange={() => setBillingInterval(plan.billingInterval)}
          />
          <Stack
            justify="center"
            align="center"
            css={css({
              size: 6,
              border: '2px solid',
              borderRadius: '50%',
              borderColor: isSelected ? 'blues.600' : 'grays.600',
              backgroundColor: isSelected ? 'blues.600' : 'transparent',
            })}
          >
            {isSelected && <Icon size={13} name="simpleCheck" />}
          </Stack>
        </div>
      </Stack>
    </Stack>
  );
};
