import React from 'react';
import { Query, Mutation } from 'react-apollo';
import { inject, Observer } from 'mobx-react';

import UserWithAvatar from 'app/components/UserWithAvatar';
import Button from 'app/components/Button';
import Margin from 'common/components/spacing/Margin';
import track from 'common/utils/analytics';

import { Container, HeaderContainer, Description } from '../../elements';
import { TeamContainer, Section, Members, MemberHeader } from './elements';
import { TEAM_QUERY, REVOKE_TEAM_INVITATION } from '../../../queries';

import AddTeamMember from './AddTeamMember';
import RemoveTeamMember from './RemoveTeamMember';

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

class TeamView extends React.PureComponent {
  render() {
    const { teamId } = this.props.match.params;

    return (
      <Container>
        <Query query={TEAM_QUERY} variables={{ id: teamId }}>
          {({ data, loading, error }) => (
            <Observer>
              {() => {
                const currentUser = this.props.store.user;
                if (loading || error) {
                  return null;
                }

                return (
                  <TeamContainer>
                    <Section>
                      <HeaderContainer>{data.me.team.name}</HeaderContainer>
                      <Description>
                        This is a description of the team, they are very cool.
                        Come here to create examples for other teams to see,
                        very interesting examples are preferred of course.
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
                              <RemoveTeamMember
                                creatorId={data.me.team.creatorId}
                                currentUserId={currentUser.id}
                                userId={user.id}
                                name={user.name || user.usermame}
                                teamId={teamId}
                                totalMemberSize={
                                  data.me.team.users.length +
                                  data.me.team.invitees.length
                                }
                              />
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
                                    track('Team - Revoke Invitation');

                                    const handleClick = () =>
                                      mutate({
                                        variables: { userId: user.id, teamId },
                                      });

                                    return (
                                      <User
                                        user={user}
                                        style={{
                                          opacity: revokeLoading ? 0.5 : 1,
                                        }}
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
            </Observer>
          )}
        </Query>
      </Container>
    );
  }
}

export default inject('store', 'signals')(TeamView);
