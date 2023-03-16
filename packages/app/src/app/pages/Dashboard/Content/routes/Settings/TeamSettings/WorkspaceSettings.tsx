import React, { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { useAppState, useActions, useEffects } from 'app/overmind';

import {
  Button,
  Element,
  Stack,
  Text,
  Menu,
  Icon,
  MessageStripe,
} from '@codesandbox/components';
import css from '@styled-system/css';
import { UserSearchInput } from 'app/components/UserSearchInput';
import { Header } from 'app/pages/Dashboard/Components/Header';
import {
  dashboard,
  teamInviteLink,
} from '@codesandbox/common/lib/utils/url-generator';
import {
  TeamMemberAuthorization,
  SubscriptionOrigin,
  SubscriptionInterval,
} from 'app/graphql/types';
import { MAX_PRO_EDITORS } from 'app/constants';
import { useWorkspaceAuthorization } from 'app/hooks/useWorkspaceAuthorization';
import { useGetCheckoutURL } from 'app/hooks';
import track from '@codesandbox/common/lib/utils/analytics';
import { useWorkspaceSubscription } from 'app/hooks/useWorkspaceSubscription';
import { useWorkspaceLimits } from 'app/hooks/useWorkspaceLimits';
import { pluralize } from 'app/utils/pluralize';
import { Card } from '../components';
import { MembersList, Role } from '../components/MemberList';
import { ManageSubscription } from './ManageSubscription';
import { TeamInfo } from '../components/TeamInfo';

const INVITE_ROLES_MAP: Record<TeamMemberAuthorization, Role[]> = {
  [TeamMemberAuthorization.Admin]: [
    TeamMemberAuthorization.Write,
    TeamMemberAuthorization.Read,
  ],
  [TeamMemberAuthorization.Write]: [TeamMemberAuthorization.Read],

  [TeamMemberAuthorization.Read]: [],
};

const ROLES_TEXT_MAP: Record<Role, string> = {
  [TeamMemberAuthorization.Write]: 'Editor',
  [TeamMemberAuthorization.Read]: 'Viewer',
};

export const WorkspaceSettings = () => {
  const actions = useActions();
  const effects = useEffects();
  const { user: currentUser, activeTeamInfo: team } = useAppState();

  const [teamInfoLoading, setLoading] = useState(false);

  const {
    isPro,
    isEligibleForTrial,
    numberOfSeats,
    subscription,
  } = useWorkspaceSubscription();
  const {
    numberOfEditors,
    hasMaxNumberOfEditors,
    numberOfEditorsIsOverTheLimit,
  } = useWorkspaceLimits();
  const {
    isBillingManager,
    isTeamAdmin,
    userRole,
    isTeamEditor,
  } = useWorkspaceAuthorization();

  const checkoutUrl = useGetCheckoutURL({
    cancel_path: dashboard.settings(team?.id),
  });

  const membersCount = team.users.length;
  const canInviteOtherMembers = isTeamAdmin || isTeamEditor;

  // We use `role` as the common term when referring to: `admin`, `editor` or `viewer`
  // But away from the team settings page and on the BE, the term `authorization` is used
  const rolesThatUserCanInvite =
    hasMaxNumberOfEditors || numberOfEditorsIsOverTheLimit
      ? // If team has reached the limit, only allow viewer roles to be invited
        [TeamMemberAuthorization.Read]
      : INVITE_ROLES_MAP[userRole];

  const [inviteValue, setInviteValue] = useState('');
  const [inviteLoading, setInviteLoading] = useState(false);

  const defaultRoleToInvite = rolesThatUserCanInvite.includes(
    team?.settings.defaultAuthorization
  )
    ? team?.settings.defaultAuthorization
    : TeamMemberAuthorization.Read;

  const [newMemberRole, setNewMemberRole] = React.useState<
    TeamMemberAuthorization
  >(defaultRoleToInvite);

  // A team can have unused seats in their subscription
  // if they have already paid for X editors for the YEARLY plan
  // then removed some members from the team
  const numberOfUnusedSeats = numberOfSeats - numberOfEditors;

  // if the user is going to be charged for adding a member
  // throw them a confirmation modal
  const confirmNewMemberAddition =
    isPro &&
    numberOfUnusedSeats === 0 &&
    newMemberRole !== TeamMemberAuthorization.Read;

  const onInviteSubmit = async event => {
    event.preventDefault();
    setInviteLoading(true);

    const inviteLink = teamInviteLink(team.inviteToken);

    await actions.dashboard.inviteToTeam({
      value: inviteValue,
      authorization: newMemberRole,
      confirm: confirmNewMemberAddition,
      triggerPlace: 'settings',
      inviteLink,
    });
    setInviteLoading(false);
  };

  if (!team || !currentUser) {
    return <Header title="Team Settings" activeTeam={null} />;
  }

  const onCopyInviteUrl = async event => {
    event.preventDefault();

    if (confirmNewMemberAddition) {
      const confirmed = await actions.modals.alertModal.open({
        title: 'Invite New Member',
        customComponent: 'MemberPaymentConfirmation',
      });
      if (!confirmed) return;
    }

    const inviteLink = teamInviteLink(team.inviteToken);

    actions.track({
      name: 'Dashboard - Copied Team Invite URL',
      data: { place: 'settings', inviteLink },
    });
    effects.browser.copyToClipboard(inviteLink);
    effects.notificationToast.success('Copied Team Invite URL!');
  };

  const created = team.users.find(user => user.id === team.creatorId);
  // const canConvertViewersToEditors =
  //   !hasMaxNumberOfEditors && !numberOfEditorsIsOverTheLimit;

  return (
    <>
      <Element
        css={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1em',

          '@media (min-width: 768px)': {
            display: 'grid',
            'grid-template-columns': 'repeat(3, 1fr)',
          },
        }}
      >
        <Card
          css={{
            'grid-column':
              isBillingManager || isEligibleForTrial ? 'auto' : '1/3',
          }}
        >
          <TeamInfo onLoadingChange={setLoading} />
        </Card>

        <Card>
          <Stack
            direction="vertical"
            justify="space-between"
            css={{ height: '100%' }}
          >
            <Stack direction="vertical" gap={4}>
              <Text size={4} weight="500">
                {membersCount}{' '}
                {pluralize({
                  word: 'member',
                  count: membersCount,
                })}
              </Text>
              <Stack direction="vertical" gap={1}>
                {isBillingManager && (
                  <>
                    <Text size={3} variant="muted">
                      {numberOfEditors}{' '}
                      {numberOfEditors > 1 ? 'Editors' : 'Editor'}
                    </Text>
                    {numberOfUnusedSeats > 0 ? (
                      <Text size={3} variant="muted">
                        +{numberOfUnusedSeats} unassigned editor{' '}
                        {pluralize({
                          word: 'seat',
                          count: numberOfUnusedSeats,
                        })}
                      </Text>
                    ) : null}
                  </>
                )}
                {created && (
                  <Text size={3} variant="muted">
                    Created by {created.username}
                  </Text>
                )}
              </Stack>
            </Stack>
            {isTeamAdmin && (
              <Button
                autoWidth
                variant="link"
                disabled={teamInfoLoading}
                css={css({
                  height: 'auto',
                  fontSize: 3,
                  color: 'errorForeground',
                  padding: 0,
                })}
                onClick={() =>
                  actions.modalOpened({ modal: 'deleteWorkspace' })
                }
              >
                Delete team
              </Button>
            )}
          </Stack>
        </Card>

        <ManageSubscription />
      </Element>
      <Stack direction="vertical" gap={3}>
        <Text
          css={css({
            display: 'flex',
            alignItems: 'center',
          })}
          size={4}
        >
          Team overview
        </Text>

        {isBillingManager && (
          <Stack gap={10}>
            <Stack
              css={{
                fontSize: '13px',
                lineHeight: '16px',
                color: '#999999',
              }}
              gap={4}
            >
              <Text>
                {pluralize({
                  count: membersCount,
                  word: 'Member',
                })}
              </Text>
              <Text>{membersCount}</Text>
            </Stack>
            <Stack
              css={{
                fontSize: '13px',
                lineHeight: '16px',
                color: '#999999',
              }}
              gap={4}
            >
              <Text>Current editors</Text>
              <Text>
                {numberOfEditors}/{numberOfSeats}
              </Text>
            </Stack>
            {subscription?.billingInterval === SubscriptionInterval.Yearly && (
              <Stack
                css={{
                  fontSize: '13px',
                  lineHeight: '16px',
                  color: '#999999',
                }}
                gap={4}
              >
                <Text>Available editor seats</Text>
                <Text color="#B3FBB4">{numberOfUnusedSeats}</Text>
              </Stack>
            )}
          </Stack>
        )}
      </Stack>

      {/**
       * Limit free plan amount of editors.
       */}
      {checkoutUrl && (numberOfEditorsIsOverTheLimit || hasMaxNumberOfEditors) && (
        <MessageStripe justify="space-between">
          <span>
            {numberOfEditorsIsOverTheLimit && (
              <>
                Free teams are limited to 5 editor seats. Some permissions might
                have changed.
              </>
            )}
            {hasMaxNumberOfEditors && (
              <>
                You&apos;ve reached the maximum amount of free editor seats.
                Upgrade for more.
              </>
            )}
          </span>
          <MessageStripe.Action
            {...(checkoutUrl.startsWith('/')
              ? {
                  as: RouterLink,
                  to: `${checkoutUrl}?utm_source=dashboard_workspace_settings`,
                }
              : {
                  as: 'a',
                  href: checkoutUrl,
                })}
            onClick={() => {
              if (isEligibleForTrial) {
                const event = 'Limit banner: team editors - Start trial';
                track(isBillingManager ? event : `${event} - As non-admin`, {
                  codesandbox: 'V1',
                  event_source: 'UI',
                });
              } else {
                track('Limit banner: team editors - Upgrade', {
                  codesandbox: 'V1',
                  event_source: 'UI',
                });
              }
            }}
          >
            {isEligibleForTrial ? 'Start trial' : 'Upgrade now'}
          </MessageStripe.Action>
        </MessageStripe>
      )}

      {/**
       * Soft limit for pro teams.
       */}
      {isBillingManager &&
        numberOfEditors > MAX_PRO_EDITORS &&
        subscription?.origin !== SubscriptionOrigin.Pilot && (
          <MessageStripe justify="space-between">
            <span>
              You have over {MAX_PRO_EDITORS} editors. Upgrade to the
              Organization plan for more benefits.
            </span>
            <MessageStripe.Action
              as="a"
              href="https://codesandbox.typeform.com/organization"
              onClick={() =>
                track('Limit banner - team editors - Custom plan contact')
              }
              target="_blank"
            >
              Contact us
            </MessageStripe.Action>
          </MessageStripe>
        )}

      {canInviteOtherMembers && (
        <Stack as="form" onSubmit={inviteLoading ? undefined : onInviteSubmit}>
          <div style={{ position: 'relative', width: '100%' }}>
            <UserSearchInput
              inputValue={inviteValue}
              allowSelf={false}
              onInputValueChange={val => setInviteValue(val)}
              style={{ paddingRight: 80 }}
            />

            <Menu>
              <Menu.Button
                css={css({
                  fontSize: 3,
                  fontWeight: 'normal',
                  paddingX: 0,
                  position: 'absolute',
                  top: 0,
                  right: 2,
                })}
              >
                <Text variant="muted">{ROLES_TEXT_MAP[newMemberRole]}</Text>
                <Icon name="caret" size={8} marginLeft={1} />
              </Menu.Button>
              <Menu.List>
                {rolesThatUserCanInvite.map(role => (
                  <Menu.Item
                    key={role}
                    onSelect={() => setNewMemberRole(role)}
                    style={{ display: 'flex', alignItems: 'center' }}
                  >
                    <Text style={{ width: '100%' }}>
                      {ROLES_TEXT_MAP[role]}
                    </Text>
                    {newMemberRole === role && (
                      <Icon name="simpleCheck" size={12} marginLeft={1} />
                    )}
                  </Menu.Item>
                ))}
              </Menu.List>
            </Menu>
          </div>

          <Button
            type="submit"
            loading={inviteLoading}
            style={{ width: 'auto', marginLeft: 8 }}
          >
            Add Member
          </Button>

          <Button
            variant="secondary"
            onClick={onCopyInviteUrl}
            style={{ width: 'auto', marginLeft: 8 }}
          >
            Copy Invite URL
          </Button>
        </Stack>
      )}

      <MembersList
        shouldConfirmRoleChange={isPro && numberOfUnusedSeats === 0}
      />
    </>
  );
};
