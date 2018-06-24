import React from 'react';
import styled, { css } from 'styled-components';
import { inject } from 'mobx-react';
import { Mutation } from 'react-apollo';

import { NotificationContainer } from '../elements';
import {
  REJECT_TEAM_INVITATION,
  ACCEPT_TEAM_INVITATION,
} from '../../../../Dashboard/queries';

const Container = NotificationContainer.extend`
  display: flex;
`;

const Image = styled.img`
  border-radius: 4px;
  width: 24px;
  height: 24px;
  margin-right: 1rem;
  margin-top: 0.25rem;
`;

const Buttons = styled.div`
  display: flex;
`;

const Button = styled.div`
  transition: 0.3s ease background-color;
  height: 36px;
  width: 100%;

  color: white;
  background-color: ${props =>
    props.decline ? props.theme.red : props.theme.secondary};

  border: 2px solid
    ${props =>
      props.decline
        ? props.theme.red.lighten(0.1)
        : props.theme.secondary.lighten(0.2)};
  display: flex;
  align-items: center;
  justify-content: center;

  cursor: pointer;

  ${props =>
    props.disabled &&
    css`
      pointer-events: none;
      opacity: 0.5;
    `};
  &:hover {
    background-color: ${props =>
      props.decline
        ? props.theme.red.lighten(0.1)
        : props.theme.secondary.lighten(0.2)};
  }
`;

const W = styled.span`
  color: white;
`;

const TeamInvite = ({
  read,
  teamId,
  teamName,
  inviterName,
  inviterAvatar,
  signals,
}) => (
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
          onCompleted={() => {
            signals.notificationAdded({
              message: `Rejected invitation to ${teamName}`,
              type: 'success',
            });
          }}
        >
          {(mutate, { loading }) => (
            <Button onClick={mutate} disabled={loading} decline>
              Decline
            </Button>
          )}
        </Mutation>
        <Mutation
          variables={{ teamId }}
          mutation={ACCEPT_TEAM_INVITATION}
          refetchQueries={['RecentNotifications', 'TeamsSidebar']}
          onCompleted={() => {
            signals.notificationAdded({
              message: `Accepted invitation to ${teamName}`,
              type: 'success',
            });
          }}
        >
          {(mutate, { loading }) => (
            <Button onClick={mutate} disabled={loading}>
              Accept
            </Button>
          )}
        </Mutation>
      </Buttons>
    )}
  </div>
);
export default inject('signals')(TeamInvite);
