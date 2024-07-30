import React from 'react';
import { recent } from '@codesandbox/common/lib/utils/url-generator/dashboard';
import { useAppState, useActions } from 'app/overmind';
import {
  REJECT_TEAM_INVITATION,
  ACCEPT_TEAM_INVITATION,
} from 'app/pages/Dashboard/queries';
import { Element, Button, Text, Stack } from '@codesandbox/components';
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
      window.location.href = recent(teamId, { new_join: 'true' });
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
    <Element css={{ padding: '16px' }}>
      <Stack direction="vertical" gap={4}>
        <Stack gap={4}>
          <TeamAvatar name={teamName} />
          <Stack direction="vertical" paddingTop={1} gap={2}>
            <Text weight="bold" block>
              Join {teamName}
            </Text>
            <Text block size={4} color="#adadad">
              You have been invited to join this workspace.
            </Text>
          </Stack>
        </Stack>
        <Stack justify="flex-end" css={{ width: '100%' }} gap={2}>
          <Button
            variant="primary"
            title="Accept Invite"
            onClick={() => acceptTeamInvitationMutation()}
            disabled={loadingAccept}
            autoWidth
          >
            <Text>Accept</Text>
          </Button>
          <Button
            variant="link"
            title="Accept invite"
            onClick={() => rejectTeamInvitationMutation()}
            disabled={loadingReject}
            autoWidth
          >
            <Text>Decline</Text>
          </Button>
        </Stack>
      </Stack>
    </Element>
  );
};
