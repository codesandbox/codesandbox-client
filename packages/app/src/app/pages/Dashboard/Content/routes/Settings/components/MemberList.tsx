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
import { useActions, useAppState } from 'app/overmind';
import {
  CurrentTeamInfoFragmentFragment,
  TeamMemberAuthorization,
} from 'app/graphql/types';
import { sortBy } from 'lodash-es';
import { useWorkspaceAuthorization } from 'app/hooks/useWorkspaceAuthorization';

type User = CurrentTeamInfoFragmentFragment['users'][number];

type Action = {
  name: string;
  disabled?: boolean;
  onSelect: () => void;
};

type Role = Exclude<TeamMemberAuthorization, TeamMemberAuthorization.Admin>;

const ROLE_MAP: Record<Role, string> = {
  WRITE: 'Editor',
  READ: 'Viewer',
};

type AuthorizationsMap = {
  [userId: string]: {
    userId: string;
    teamManager: boolean;
    teamAdmin: boolean;
    role: Role;
  };
};

type MemberListProps = {
  shouldConfirmRoleChange: boolean;
};
export const MembersList: React.FC<MemberListProps> = ({
  shouldConfirmRoleChange,
}) => {
  const { activeTeamInfo, user: currentUser } = useAppState();
  const {
    dashboard: { changeAuthorization, leaveTeam, removeFromTeam },
  } = useActions();
  const { isTeamAdmin } = useWorkspaceAuthorization();

  if (activeTeamInfo === null) {
    return null;
  }

  const currentUserId = currentUser?.id;
  const {
    // invitees,
    users,
    userAuthorizations,
  } = activeTeamInfo;

  const authorizationsMap = userAuthorizations.reduce((acc, auth) => {
    const { userId, authorization, teamManager } = auth;
    const isAdmin = authorization === TeamMemberAuthorization.Admin;

    acc[userId] = {
      userId,
      teamManager,
      teamAdmin: isAdmin,
      role: isAdmin ? TeamMemberAuthorization.Write : authorization,
    };

    return acc;
  }, {} as AuthorizationsMap);

  // Returns either options for the role dropdown or a string
  // to render if the user is not allowed to change the role.
  const buildRoleOptions = (member: User): Action[] | string => {
    const memberAuth = authorizationsMap[member.id];
    if (memberAuth.teamAdmin) {
      return 'Editor';
    }

    if (!isTeamAdmin) {
      return ROLE_MAP[memberAuth.role];
    }

    return [
      {
        name: 'Editor',
        onSelect: () => {
          changeAuthorization({
            userId: member.id,
            authorization: TeamMemberAuthorization.Write,
            teamManager: memberAuth.teamManager,
            confirm: shouldConfirmRoleChange,
          });
        },
      },
      {
        name: 'Viewer',
        onSelect: () => {
          changeAuthorization({
            userId: member.id,
            authorization: TeamMemberAuthorization.Read,
            teamManager: memberAuth.teamManager,
          });
        },
      },
    ];
  };

  // Used in the "more" menu at the end of the row.
  const buildMemberActions = (member: User): Action[] => {
    const memberAuth = authorizationsMap[member.id];

    if (member.id === currentUserId) {
      // TO DO: prevent leaving team if you are the only admin.
      return [
        {
          name: 'Leave team',
          onSelect: leaveTeam,
        },
      ];
    }

    // If the member isn't the current user or the current
    // user is not an admin, no actions are allowed.
    if (!isTeamAdmin) {
      return [];
    }

    const actions = [];

    if (memberAuth.teamAdmin) {
      actions.push({
        name: 'Revoke admin rights',
        onSelect: () =>
          changeAuthorization({
            userId: member.id,
            authorization: TeamMemberAuthorization.Write,
            teamManager: memberAuth.teamManager,
          }),
      });
    } else {
      actions.push({
        name: 'Grant admin rights',
        onSelect: () =>
          changeAuthorization({
            userId: member.id,
            authorization: TeamMemberAuthorization.Admin,
            teamManager: memberAuth.teamManager,
            confirm: shouldConfirmRoleChange,
          }),
      });
    }

    // Get the original authorization to pass to the API.
    const mappedMemberAuthorization = memberAuth.teamAdmin
      ? TeamMemberAuthorization.Admin
      : memberAuth.role;
    if (memberAuth.teamManager) {
      actions.push({
        name: 'Revoke billing rights',
        onSelect: () =>
          changeAuthorization({
            userId: member.id,
            authorization: mappedMemberAuthorization,
            teamManager: false,
          }),
      });
    } else {
      actions.push({
        name: 'Grant billing rights',
        onSelect: () =>
          changeAuthorization({
            userId: member.id,
            authorization: mappedMemberAuthorization,
            teamManager: true,
          }),
      });
    }

    actions.push({
      name: 'Remove member',
      onSelect: () => removeFromTeam(member.id),
    });
    return actions;
  };

  return (
    <List>
      {sortBy(users, u => u.id !== currentUserId).map(user => {
        const authorization = authorizationsMap[user.id];
        const actions = buildMemberActions(user);
        const roleOptions = buildRoleOptions(user);

        return (
          <ListAction
            key={user.id}
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
                  <Avatar user={user} />
                  <Stack align="center" gap={2}>
                    <Text size={3}>{user.username}</Text>
                    {user.id === currentUserId ? (
                      <Text size={3} variant="muted">
                        (You)
                      </Text>
                    ) : null}
                    {authorization.teamAdmin ? <Badge>Admin</Badge> : null}
                    {authorization.teamManager ? <Badge>Billing</Badge> : null}
                  </Stack>
                </Stack>
              </Column>
              <Column span={5}>
                {typeof roleOptions === 'string' ? (
                  <Text size={3}>{ROLE_MAP[authorization.role]}</Text>
                ) : (
                  <Menu>
                    <Menu.Button
                      style={{ paddingLeft: 0, paddingRight: 0 }}
                      css={{ fontSize: '13px', fontWeight: 'normal' }}
                    >
                      <Text variant="muted">
                        {ROLE_MAP[authorization.role]}
                      </Text>
                      <Icon name="chevronDown" size={8} marginLeft={1} />
                    </Menu.Button>
                    <Menu.List>
                      {roleOptions.map(action => (
                        <Menu.Item
                          key={action.name}
                          onSelect={action.onSelect}
                          style={{ display: 'flex', alignItems: 'center' }}
                        >
                          <Text style={{ width: '100%' }}>{action.name}</Text>
                          {action.name === ROLE_MAP[authorization.role] && (
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
                {actions.length > 0 ? (
                  <Menu>
                    <Menu.IconButton
                      name="more"
                      size={9}
                      title="Member options"
                    />
                    <Menu.List>
                      {actions.map(action => (
                        <Menu.Item key={action.name} onSelect={action.onSelect}>
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
    </List>
  );
};
