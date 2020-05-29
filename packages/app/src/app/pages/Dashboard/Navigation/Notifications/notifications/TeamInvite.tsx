import { teamOverviewUrl } from '@codesandbox/common/es/utils/url-generator';
import { useOvermind } from 'app/overmind';
import {
  ACCEPT_TEAM_INVITATION,
  REJECT_TEAM_INVITATION,
} from 'app/pages/Dashboard/queries';
import history from 'app/utils/history';
import React, { FunctionComponent } from 'react';
import { Mutation } from 'react-apollo';

import { NotificationImage as Image } from '../elements';
import { Button, Buttons, Container, W } from './elements';

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
              acceptTeamInvitation({ teamName, teamId });

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
