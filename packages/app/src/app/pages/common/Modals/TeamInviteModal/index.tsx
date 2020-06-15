import React from 'react';
import { teamOverviewUrl } from '@codesandbox/common/lib/utils/url-generator';
import { useOvermind } from 'app/overmind';
import {
  REJECT_TEAM_INVITATION,
  ACCEPT_TEAM_INVITATION,
} from 'app/pages/Dashboard/queries';
import history from 'app/utils/history';
import { Element, Button, Text } from '@codesandbox/components';
import css from '@styled-system/css';
import { useMutation } from '@apollo/react-hooks';

export const TeamInviteModal = () => {
  const {
    actions: { acceptTeamInvitation, rejectTeamInvitation, modalClosed },
    state: {
      userNotifications: { activeInvitation },
    },
  } = useOvermind();

  const { teamId, teamName } = activeInvitation || {};

  const [
    acceptTeamInvitationMutation,
    { loading: loadingAccept },
  ] = useMutation(ACCEPT_TEAM_INVITATION, {
    refetchQueries: ['RecentNotifications', 'TeamsSidebar'],
    variables: {
      teamId,
    },
    onCompleted: () => {
      acceptTeamInvitation({ teamName, teamId });
      modalClosed();
      history.push(teamOverviewUrl(teamId));
    },
  });
  const [
    rejectTeamInvitationMutation,
    { loading: loadingReject },
  ] = useMutation(REJECT_TEAM_INVITATION, {
    refetchQueries: ['RecentNotifications'],
    variables: {
      teamId,
    },
    onCompleted: () => {
      rejectTeamInvitation({ teamName });
      modalClosed();
    },
  });

  return (
    <Element
      padding={4}
      paddingTop={6}
      css={css({
        maxHeight: '70vh',
        overflow: 'auto',
        textAlign: 'center',
      })}
    >
      <Text align="center" weight="bold" block size={4} paddingBottom={2}>
        {teamName}
      </Text>
      <Text align="center" variant="muted" marginBottom={6} size={3} block>
        Accept the invite to become a team member
      </Text>
      <Button
        variant="primary"
        title="Accept Invite"
        marginBottom={4}
        // @ts-ignore
        marginX="auto"
        css={css({
          display: 'block',
          width: 'auto',
        })}
        onClick={() => acceptTeamInvitationMutation()}
        disabled={loadingAccept}
      >
        <Text>Accept Invite</Text>
      </Button>
      <Button
        variant="link"
        title="Accept Invite"
        css={css({
          display: 'block',
          width: 'auto',
          margin: 'auto',
        })}
        onClick={() => rejectTeamInvitationMutation()}
        disabled={loadingReject}
      >
        <Text>Decline Invite</Text>
      </Button>
    </Element>
  );
};
