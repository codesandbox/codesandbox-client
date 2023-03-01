import * as React from 'react';
import { css } from '@styled-system/css';
import {
  List,
  ListAction,
  Grid,
  Column,
  Stack,
  Avatar,
  Menu,
  Text,
  Icon,
} from '@codesandbox/components';

export type User = {
  id: string;
  avatarUrl: string;
  username: string;
};

type ActionType = {
  label: string;
  onSelect: () => void;
};

type getActionsType = (user: User) => Array<ActionType>;

interface MemberListProps {
  getPermission: (user: User) => string;
  getPermissionOptions: getActionsType;
  getActions: getActionsType;
  users: User[];
}

export const MemberList: React.FC<MemberListProps> = ({
  getPermission,
  getPermissionOptions,
  users,
  getActions,
}) => (
  <List>
    {users.map(user => {
      const actions = getActions(user);
      const permissionActions = getPermissionOptions(user);

      const permissionMap = {
        ADMIN: 'Admin',
        WRITE: 'Editor',
        READ: 'Viewer',
        PENDING: 'Pending...',
      };

      return (
        <ListAction
          key={user.username}
          align="center"
          justify="space-between"
          css={css({
            height: 64,
            borderBottom: '1px solid',
            borderColor: 'grays.600',
          })}
        >
          <Grid css={{ width: '100%' }}>
            <Column span={6}>
              <Stack
                gap={4}
                align="center"
                css={{ height: '100%', width: '100%' }}
              >
                <Avatar user={user} />
                <Text size={3} style={{ color: 'white' }}>
                  {user.username}
                </Text>
              </Stack>
            </Column>
            <Column span={6}>
              <Stack
                justify="space-between"
                align="center"
                css={{ height: '100%' }}
              >
                {permissionActions.length ? (
                  <Menu>
                    <Menu.Button
                      style={{ paddingLeft: 0, paddingRight: 0 }}
                      css={css({
                        fontSize: 3,
                        fontWeight: 'normal',
                        color: 'grays.200',
                      })}
                    >
                      <Text>{permissionMap[getPermission(user)]}</Text>
                      <Icon name="chevronDown" size={8} marginLeft={1} />
                    </Menu.Button>
                    <Menu.List>
                      {permissionActions.map(action => (
                        <Menu.Item
                          key={action.label}
                          onSelect={action.onSelect}
                          style={{ display: 'flex', alignItems: 'center' }}
                        >
                          <Text style={{ width: '100%' }}>{action.label}</Text>
                          {action.label ===
                            permissionMap[getPermission(user)] && (
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
                ) : (
                  <Text variant="muted" size={3} css={css({ width: '100%' })}>
                    {permissionMap[getPermission(user)]}
                  </Text>
                )}
                {actions.length > 0 ? (
                  <Menu>
                    <Menu.IconButton
                      name="more"
                      size={14}
                      title="Member options"
                    />
                    <Menu.List>
                      {actions.map(action => (
                        <Menu.Item
                          key={action.label}
                          onSelect={action.onSelect}
                        >
                          {action.label}
                        </Menu.Item>
                      ))}
                    </Menu.List>
                  </Menu>
                ) : null}
              </Stack>
            </Column>
          </Grid>
        </ListAction>
      );
    })}
  </List>
);
