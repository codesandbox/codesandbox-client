import React from 'react';
import {
  Avatar,
  Badge,
  Column,
  Grid,
  Icon,
  List,
  ListAction,
  Menu,
  Stack,
  Text,
} from '@codesandbox/components';
import track from '@codesandbox/common/lib/utils/analytics';
import { useActions, useAppState } from 'app/overmind';
import {
  CurrentTeamInfoFragmentFragment,
  TeamMemberAuthorization,
} from 'app/graphql/types';
import { useWorkspaceAuthorization } from 'app/hooks/useWorkspaceAuthorization';

enum Role {
  Editor = 'EDITOR',
  Viewer = 'VIEWER',
}

type User = CurrentTeamInfoFragmentFragment['users'][number];

type Action = {
  name: string;
  onSelect: () => void;
  disabled?: boolean;
};

type AuthorizationsMap = {
  [userId: string]: {
    /**
     * Defines if the user is allowed to perform payment-related actions. All
     * admins are billing managers but not all billing managers are admins.
     */
    billingManager: boolean;
    /**
     * Has the highest clearance, is always a billing manager and can perform
     * administrative actions such as token management and team deletion.
     */
    teamAdmin: boolean;
    /**
     * How the user is allowed to interact with the sandboxes and repositories.
     */
    role: Role;
    /**
     * 1:1 map of the authorization from the API, used to perform the mutations.
     */
    authorization: TeamMemberAuthorization;
  };
};

type Member = User & AuthorizationsMap[keyof AuthorizationsMap];

const MAP_ROLES_TO_LABEL: Record<Role, string> = {
  EDITOR: 'Editor',
  VIEWER: 'Viewer',
};

const MAP_AUTHORIZATION_TO_ROLE: Record<TeamMemberAuthorization, Role> = {
  [TeamMemberAuthorization.Admin]: Role.Editor,
  [TeamMemberAuthorization.Write]: Role.Editor,
  [TeamMemberAuthorization.Read]: Role.Viewer,
};

type MemberListProps = {
  /**
   * If a free team has reached the max number of editors,
   * it's not possible to change a viewer to an editor.
   */
  restrictNewEditors: boolean;
  /**
   * If a paid team has filled their seats, warn them that
   * changing an user from viewer to editor will increase
   * their bill.
   */
  shouldConfirmRoleChange: boolean;
};
export const MembersList: React.FC<MemberListProps> = ({
  restrictNewEditors,
  shouldConfirmRoleChange,
}) => {
  const { activeTeamInfo, user } = useAppState();
  const {
    dashboard: {
      changeAuthorization,
      leaveTeam,
      removeFromTeam,
      revokeTeamInvitation,
    },
    modalOpened,
  } = useActions();
  const {
    isTeamAdmin,
    isTeamViewer,
    isPersonalSpace,
  } = useWorkspaceAuthorization();

  const currentUserId = user?.id;
  const invitees = activeTeamInfo?.invitees;
  const authorizations = React.useMemo(() => {
    return (activeTeamInfo?.userAuthorizations ?? []).reduce((acc, cur) => {
      const { userId, authorization, teamManager } = cur;
      const isAdmin = authorization === TeamMemberAuthorization.Admin;

      acc[userId] = {
        billingManager: isAdmin || teamManager,
        teamAdmin: isAdmin,
        role: MAP_AUTHORIZATION_TO_ROLE[authorization],
        authorization,
      };

      return acc;
    }, {} as AuthorizationsMap);
  }, [activeTeamInfo]);

  const members = React.useMemo<Member[]>(() => {
    return (activeTeamInfo?.users ?? [])
      .map(member => {
        const authorization = authorizations[member.id];

        return { ...member, ...authorization };
      })
      .sort((a, b) => {
        // Show team admins first, then billing managers and then
        // the other members. Each group is sorted alphabetically.
        if (a.teamAdmin && !b.teamAdmin) {
          return -1;
        }
        if (!a.teamAdmin && b.teamAdmin) {
          return 1;
        }
        if (a.billingManager && !b.billingManager) {
          return -1;
        }

        if (!a.billingManager && b.billingManager) {
          return 1;
        }

        return a.username.localeCompare(b.username);
      });
  }, [activeTeamInfo, authorizations]);

  const teamAdminsCount = Object.values(authorizations).filter(
    auth => auth.teamAdmin
  ).length;

  /**
   * Returns either options for the role dropdown or a string to render
   * if the user is not allowed to change the role.
   */
  const buildRoleOptions = (member: Member): Action[] | string => {
    if (member.teamAdmin) {
      return 'Editor';
    }

    return [
      {
        name: 'Editor',
        onSelect: () => {
          if (member.role === Role.Editor) {
            return;
          }

          if (restrictNewEditors) {
            modalOpened({ modal: 'editorSeatsUpgrade' });
            return;
          }

          track('Change role to editor', {
            codesandbox: 'V1',
            event_source: 'UI',
          });

          changeAuthorization({
            userId: member.id,
            authorization: TeamMemberAuthorization.Write,
            teamManager: member.billingManager,
            confirm: shouldConfirmRoleChange,
          });
        },
      },
      {
        name: 'Viewer',
        onSelect: () => {
          track('Change role to viewer', {
            codesandbox: 'V1',
            event_source: 'UI',
          });

          changeAuthorization({
            userId: member.id,
            authorization: TeamMemberAuthorization.Read,
            teamManager: member.billingManager,
          });
        },
      },
    ];
  };

  const buildMemberActions = (member: Member): Action[] => {
    if (!isTeamAdmin && !isPersonalSpace) {
      // If the user is not the team admin, the only possible
      // action is to leave the team.
      // We also test for personal spaces, as you are not able to leave them yet
      if (member.id === currentUserId) {
        return [
          {
            name: 'Leave team',
            onSelect: leaveTeam,
          },
        ];
      }

      return [];
    }

    const actions = [];

    // If the member is a team admin and there's more than
    // one admin, their admin rights can be revoked.
    if (member.teamAdmin && teamAdminsCount > 1) {
      actions.push({
        name: 'Revoke admin rights',
        onSelect: () => {
          track('Revoke admin rights', {
            codesandbox: 'V1',
            event_source: 'UI',
          });

          changeAuthorization({
            userId: member.id,
            authorization: TeamMemberAuthorization.Write,
            teamManager: false,
          });
        },
      });
    } else if (!member.teamAdmin) {
      actions.push({
        name: 'Make user an admin',
        onSelect: () => {
          track('Make user an admin', {
            codesandbox: 'V1',
            event_source: 'UI',
          });

          if (member.role === Role.Viewer && restrictNewEditors) {
            modalOpened({ modal: 'editorSeatsUpgrade' });
            return;
          }

          changeAuthorization({
            userId: member.id,
            authorization: TeamMemberAuthorization.Admin,
            teamManager: true,
            // Show confirmation prompt if the team has filled their seats.
            confirm: member.role === Role.Viewer && shouldConfirmRoleChange,
          });
        },
      });
    }

    if (member.billingManager && !member.teamAdmin) {
      actions.push({
        name: 'Revoke billing rights',
        onSelect: () => {
          track('Revoke billing rights', {
            codesandbox: 'V1',
            event_source: 'UI',
          });

          changeAuthorization({
            userId: member.id,
            authorization: member.authorization,
            teamManager: false,
          });
        },
      });
    } else if (!member.billingManager) {
      actions.push({
        name: 'Assign billing rights',
        onSelect: () => {
          track('Assign billing rights', {
            codesandbox: 'V1',
            event_source: 'UI',
          });
          changeAuthorization({
            userId: member.id,
            authorization: member.authorization,
            teamManager: true,
          });
        },
      });
    }

    // If the user is not the only team admin, they can leave the team.
    // We also test for personal spaces, as you are not able to leave them yet
    if (
      member.id === currentUserId &&
      teamAdminsCount > 1 &&
      !isPersonalSpace
    ) {
      actions.push({
        name: 'Leave team',
        onSelect: () => {
          track('Leave team', {
            codesandbox: 'V1',
            event_source: 'UI',
          });
          leaveTeam();
        },
      });
    } else if (member.id !== currentUserId) {
      actions.push({
        name: 'Remove member',
        onSelect: () => {
          track('Remove member', {
            codesandbox: 'V1',
            event_source: 'UI',
          });
          removeFromTeam(member.id);
        },
      });
    }

    return actions;
  };

  return (
    <List>
      {members.map(member => {
        const roleOptions = buildRoleOptions(member);
        const memberActions = buildMemberActions(member);

        return (
          <ListAction
            key={member.id}
            align="center"
            justify="space-between"
            css={{
              height: 64,
              borderBottom: '1px solid #242424',
            }}
          >
            <Grid css={{ width: '100%', alignItems: 'center' }}>
              <Column span={6}>
                <Stack align="center" gap={6}>
                  <Avatar user={member} />
                  <Stack align="center" gap={2}>
                    <Text size={3}>{member.username}</Text>
                    {member.id === currentUserId ? (
                      <Text size={3} variant="muted">
                        (You)
                      </Text>
                    ) : null}
                    {member.teamAdmin ? <Badge>Admin</Badge> : null}
                    {member.billingManager && !member.teamAdmin ? (
                      <Badge>Billing</Badge>
                    ) : null}
                  </Stack>
                </Stack>
              </Column>
              <Column span={5}>
                {typeof roleOptions === 'string' ? (
                  <Text size={3}>{roleOptions}</Text>
                ) : (
                  <Menu>
                    <Menu.Button
                      style={{ paddingLeft: 0, paddingRight: 0 }}
                      css={{ fontSize: '13px', fontWeight: 'normal' }}
                    >
                      <Text variant="muted">
                        {MAP_ROLES_TO_LABEL[member.role]}
                      </Text>
                      <Icon name="chevronDown" size={8} marginLeft={1} />
                    </Menu.Button>
                    <Menu.List>
                      {roleOptions.map(action => (
                        <Menu.Item
                          key={action.name}
                          disabled={action.disabled}
                          onSelect={action.onSelect}
                        >
                          <Text style={{ width: '100%' }}>{action.name}</Text>
                          {action.name === MAP_ROLES_TO_LABEL[member.role] && (
                            <Icon
                              style={{}}
                              name="simpleCheck"
                              size={12}
                              marginLeft={1}
                            />
                          )}
                        </Menu.Item>
                      ))}
                    </Menu.List>
                  </Menu>
                )}
              </Column>
              <Column span={1}>
                {memberActions.length > 0 ? (
                  <Menu>
                    <Menu.IconButton
                      name="more"
                      size={9}
                      title="Member options"
                    />
                    <Menu.List>
                      {memberActions.map(action => (
                        <Menu.Item
                          key={action.name}
                          disabled={action.disabled}
                          onSelect={action.onSelect}
                        >
                          {action.name}
                        </Menu.Item>
                      ))}
                    </Menu.List>
                  </Menu>
                ) : null}
              </Column>
            </Grid>
          </ListAction>
        );
      })}
      {invitees && invitees.length > 0
        ? invitees.map(invitee => (
            <ListAction
              key={invitee.id}
              align="center"
              justify="space-between"
              css={{
                height: 64,
                borderBottom: '1px solid #242424',
              }}
            >
              <Grid css={{ width: '100%', alignItems: 'center' }}>
                <Column span={6}>
                  <Stack align="center" gap={6}>
                    <Avatar user={invitee} />
                    <Text size={3}>{invitee.username}</Text>
                  </Stack>
                </Column>
                <Column span={5}>
                  <Text size={3}>Pending...</Text>
                </Column>
                <Column span={1}>
                  <Menu>
                    <Menu.IconButton
                      name="more"
                      size={9}
                      title="Member options"
                    />
                    <Menu.List>
                      <Menu.Item
                        disabled={isTeamViewer}
                        onSelect={() => {
                          if (isTeamViewer) {
                            return;
                          }

                          track('Revoke pending invitation', {
                            codesandbox: 'V1',
                            event_source: 'UI',
                          });
                          revokeTeamInvitation({
                            teamId: activeTeamInfo.id,
                            userId: invitee.id,
                          });
                        }}
                      >
                        Revoke invitation
                      </Menu.Item>
                    </Menu.List>
                  </Menu>
                </Column>
              </Grid>
            </ListAction>
          ))
        : null}
    </List>
  );
};
