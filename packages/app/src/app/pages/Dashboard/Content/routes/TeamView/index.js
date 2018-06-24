import React from 'react';
import { Query, Mutation } from 'react-apollo';

import UserWithAvatar from 'app/components/UserWithAvatar';
import Button from 'app/components/Button';
import Margin from 'common/components/spacing/Margin';

import { Container, HeaderContainer, Description } from '../../elements';
import { TeamContainer, Section, Members, MemberHeader } from './elements';
import { TEAM_QUERY, REVOKE_TEAM_INVITATION } from '../../../queries';

import AddTeamMember from './AddTeamMember';

const User = ({ user, rightElement }) => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      fontWeight: 600,
      marginBottom: '.5rem',
      color: 'rgba(255, 255, 255, 0.9)',
    }}
  >
    <div style={{ width: '100%' }}>
      <UserWithAvatar
        name={user.name}
        username={user.username}
        avatarUrl={user.avatarUrl}
        hideBadge
        useBigName
      />
    </div>

    {rightElement}
  </div>
);

export default class TeamView extends React.PureComponent {
  render() {
    const { teamId } = this.props.match.params;

    return (
      <Container>
        <Query query={TEAM_QUERY} variables={{ id: teamId }}>
          {({ data, loading, error }) => {
            if (loading || error) {
              return null;
            }

            return (
              <TeamContainer>
                <Section>
                  <HeaderContainer>{data.me.team.name}</HeaderContainer>
                  <Description>
                    This is a description of the team, they are very cool. Come
                    here to create examples for other teams to see, very
                    interesting examples are preferred of course.
                  </Description>
                </Section>
                <Section>
                  <HeaderContainer>Team Members</HeaderContainer>

                  <Members style={{ fontSize: '1rem' }}>
                    {data.me.team.users.map(user => (
                      <User
                        user={user}
                        key={user.username}
                        rightElement={
                          data.me.team.creatorId === user.id && (
                            <div
                              style={{
                                float: 'right',
                                fontSize: '.875rem',
                                fontWeight: 400,
                                fontStyle: 'italic',
                              }}
                            >
                              Owner
                            </div>
                          )
                        }
                      />
                    ))}

                    {data.me.team.invitees &&
                      data.me.team.invitees.length > 0 && (
                        <React.Fragment>
                          <MemberHeader>Invited Members</MemberHeader>

                          {data.me.team.invitees.map(user => (
                            <Mutation
                              key={user.username}
                              mutation={REVOKE_TEAM_INVITATION}
                            >
                              {(mutate, { loading: revokeLoading }) => {
                                const handleClick = () =>
                                  mutate({
                                    variables: { userId: user.id, teamId },
                                  });

                                return (
                                  <User
                                    user={user}
                                    style={{ opacity: revokeLoading ? 0.5 : 1 }}
                                    rightElement={
                                      <div
                                        style={{
                                          float: 'right',
                                          fontSize: '.75rem',
                                        }}
                                      >
                                        <Button
                                          onClick={handleClick}
                                          disabled={revokeLoading}
                                          small
                                        >
                                          {revokeLoading
                                            ? 'Revoking...'
                                            : 'Revoke'}
                                        </Button>
                                      </div>
                                    }
                                  />
                                );
                              }}
                            </Mutation>
                          ))}
                        </React.Fragment>
                      )}

                    <Margin top={1}>
                      <AddTeamMember teamId={teamId} />
                    </Margin>
                  </Members>
                </Section>
              </TeamContainer>
            );
          }}
        </Query>
      </Container>
    );
  }
}
