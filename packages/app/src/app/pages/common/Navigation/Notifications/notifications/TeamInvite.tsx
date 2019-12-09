import { teamOverviewUrl } from '@codesandbox/common/lib/utils/url-generator';
import React, { FunctionComponent } from 'react';
import { Mutation } from 'react-apollo';

import { useOvermind } from 'app/overmind';
import {
  REJECT_TEAM_INVITATION,
  ACCEPT_TEAM_INVITATION,
} from 'app/pages/Dashboard/queries';
import history from 'app/utils/history';

import { NotificationImage as Image } from '../elements';

import { Container, Buttons, Button, W } from './elements';

type Props = {
  read: boolean;
  teamId: string;
  teamName: string;
  inviterName: string;
  inviterAvatar: string;
};
export const TeamInvite: FunctionComponent<Props> = ({
  read,
  teamId,
  teamName,
  inviterName,
  inviterAvatar,
}) => {
  const {
    actions: { acceptTeamInvitation, rejectTeamInvitation },
  } = useOvermind();

  return (
    <div>
      <Container read={read}>
        <Image src={inviterAvatar} />

        <div>
          <W>{inviterName}</W> invites you to join team <W>{teamName}</W>
        </div>
      </Container>

      {!read && (
        <Buttons>
          <Mutation
            variables={{ teamId }}
            mutation={REJECT_TEAM_INVITATION}
            refetchQueries={['RecentNotifications']}
            onCompleted={() => rejectTeamInvitation({ teamName })}
          >
            {(mutate, { loading }) => (
              <Button onClick={() => mutate()} disabled={loading} decline>
                Decline
              </Button>
            )}
          </Mutation>

          <Mutation
            variables={{ teamId }}
            mutation={ACCEPT_TEAM_INVITATION}
            refetchQueries={['RecentNotifications', 'TeamsSidebar']}
            onCompleted={() => {
              acceptTeamInvitation({ teamName });

              history.push(teamOverviewUrl(teamId));
            }}
          >
            {(mutate, { loading }) => (
              <Button onClick={() => mutate()} disabled={loading}>
                Accept
              </Button>
            )}
          </Mutation>
        </Buttons>
      )}
    </div>
  );
};
