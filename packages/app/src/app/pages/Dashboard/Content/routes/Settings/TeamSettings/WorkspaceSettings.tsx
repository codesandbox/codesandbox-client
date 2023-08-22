import React from 'react';
import css from '@styled-system/css';
import {
  Button,
  Element,
  Stack,
  Text,
  MessageStripe,
} from '@codesandbox/components';
import { useAppState, useActions } from 'app/overmind';
import { Header } from 'app/pages/Dashboard/Components/Header';
import { SubscriptionOrigin, SubscriptionInterval } from 'app/graphql/types';
import { MAX_PRO_EDITORS, ORGANIZATION_CONTACT_LINK } from 'app/constants';
import { useWorkspaceAuthorization } from 'app/hooks/useWorkspaceAuthorization';
import { useCreateCheckout } from 'app/hooks';
import track from '@codesandbox/common/lib/utils/analytics';
import { useWorkspaceSubscription } from 'app/hooks/useWorkspaceSubscription';
import { useWorkspaceLimits } from 'app/hooks/useWorkspaceLimits';
import { pluralize } from 'app/utils/pluralize';
import { Card } from '../components';
import { MembersList } from '../components/MemberList';
import { ManageSubscription } from './ManageSubscription';
import { TeamInfo } from '../components/TeamInfo';
import { InviteMember } from '../components/InviteMember';

export const WorkspaceSettings: React.FC = () => {
  const actions = useActions();
  const { user: currentUser, activeTeamInfo: team } = useAppState();

  const {
    isPro,
    isEligibleForTrial,
    numberOfSeats,
    subscription,
    isInactiveTeam,
  } = useWorkspaceSubscription();
  const {
    numberOfEditors,
    hasMaxNumberOfEditors,
    numberOfEditorsIsOverTheLimit,
  } = useWorkspaceLimits();
  const {
    isBillingManager,
    isTeamAdmin,
    isTeamEditor,
  } = useWorkspaceAuthorization();

  const [checkout, createCheckout, canCheckout] = useCreateCheckout();

  const membersCount = team.users.length;
  const canInviteOtherMembers = isTeamAdmin || isTeamEditor;

  // A team can have unused seats in their subscription
  // if they have already paid for X editors for the YEARLY plan
  // then removed some members from the team
  const numberOfUnusedSeats = numberOfSeats - numberOfEditors;

  const created = team.users.find(user => user.id === team.creatorId);
  const restrictNewEditors =
    hasMaxNumberOfEditors || numberOfEditorsIsOverTheLimit || isInactiveTeam;

  if (!team || !currentUser) {
    return <Header title="Team Settings" activeTeam={null} />;
  }

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
          <TeamInfo />
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
       * Limit free plan amount of editors. The banner is shown if
       * the user is the admin or can start a free trial, otherwise
       * the user can only invite viewers and the banner isn't
       * relevant.
       */}
      {canCheckout && restrictNewEditors && (
        <MessageStripe justify="space-between">
          <span>
            {isInactiveTeam && (
              <>
                Team is inactive. Subscribe to Pro if you want to invite new
                team members.
              </>
            )}
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
            disabled={checkout.status === 'loading'}
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

              createCheckout({
                utm_source: 'dashboard_workspace_settings',
              });
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
              href={ORGANIZATION_CONTACT_LINK}
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
        <InviteMember
          isPro={isPro}
          numberOfUnusedSeats={numberOfUnusedSeats}
          restrictNewEditors={restrictNewEditors}
          team={team}
        />
      )}

      <MembersList
        restrictNewEditors={restrictNewEditors}
        shouldConfirmRoleChange={isPro && numberOfUnusedSeats === 0}
      />
    </>
  );
};
