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
} from '@codesandbox/components';

type User = {
  id: string;
  avatarUrl: string;
  username: string;
};

type getActionsType = (
  user: User
) => Array<{
  label: string;
  onSelect: () => void;
}>;

interface MemberListProps {
  getPermission: (user: User) => string;
  getActions: getActionsType;
  users: User[];
}

export const MemberList: React.FC<MemberListProps> = ({
  getPermission,
  users,
  getActions,
}) => (
  <List>
    {users.map(user => {
      const actions = getActions(user);

      const permissionMap = {
        ADMIN: 'Admin',
        WRITE: 'Can Edit',
        READ: 'Can View',
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
                <Text size={3}>{user.username}</Text>
              </Stack>
            </Column>
            <Column span={6}>
              <Stack
                justify="space-between"
                align="center"
                css={{ height: '100%' }}
              >
                <Text variant="muted" size={3} css={css({ width: '100%' })}>
                  {permissionMap[getPermission(user)]}
                </Text>
                {actions.length > 0 ? (
                  <Menu>
                    <Menu.IconButton
                      name="more"
                      size={9}
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
