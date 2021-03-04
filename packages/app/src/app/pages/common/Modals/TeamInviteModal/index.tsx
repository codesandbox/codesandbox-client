import React from 'react';
import { teamOverviewUrl } from '@codesandbox/common/lib/utils/url-generator';
import { useAppState, useActions } from 'app/overmind';
import {
  REJECT_TEAM_INVITATION,
  ACCEPT_TEAM_INVITATION,
} from 'app/pages/Dashboard/queries';
import history from 'app/utils/history';
import { Element, Button, Text } from '@codesandbox/components';
import css from '@styled-system/css';
import { useMutation } from '@apollo/react-hooks';
import { TeamAvatar } from 'app/components/TeamAvatar';

export const TeamInviteModal = () => {
  const {
    acceptTeamInvitation,
    rejectTeamInvitation,
    modalClosed,
  } = useActions();
  const { activeInvitation } = useAppState().userNotifications;
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
      padding={6}
      paddingTop={8}
      css={css({
        maxHeight: '70vh',
        overflow: 'auto',
        textAlign: 'center',
      })}
    >
      <button
        type="button"
        onClick={modalClosed}
        css={css({
          position: 'absolute',
          background: 'transparent',
          border: 'none',
          right: 4,
          top: 4,
          cursor: 'pointer',
        })}
      >
        <svg width={10} height={10} fill="none" viewBox="0 0 10 10">
          <path
            fill="#fff"
            d="M10 .91L9.09 0 5 4.09.91 0 0 .91 4.09 5 0 9.09l.91.91L5 5.91 9.09 10l.91-.91L5.91 5 10 .91z"
          />
        </svg>
      </button>
      <TeamAvatar
        name={teamName}
        css={css({
          width: 80,
          height: 80,
          margin: 'auto',
          marginBottom: 6,
          border: '2px solid #242424',
          borderRadius: 'medium',

          span: {
            fontSize: 8,
          },
        })}
      />
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
