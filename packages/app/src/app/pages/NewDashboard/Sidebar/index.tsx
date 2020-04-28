import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { useOvermind } from 'app/overmind';
import {
  Element,
  List,
  ListAction,
  Link,
  Avatar,
  Text,
  Menu,
  Stack,
  Icon,
} from '@codesandbox/components';
import css from '@styled-system/css';

const SIDEBAR_WIDTH = 240;

export const Sidebar = props => {
  const {
    state: { dashboard, user },
    actions,
  } = useOvermind();

  React.useEffect(() => {
    actions.dashboard.getTeams();
  }, [actions.dashboard, user]);

  let activeAccount: { username: string; avatarUrl: string } = {
    username: null,
    avatarUrl: null,
  };

  if (dashboard.activeTeam) {
    const team = dashboard.teams.find(t => t.id === dashboard.activeTeam);
    if (team)
      activeAccount = {
        username: team.name,
        avatarUrl: 'https://github.com/github.png',
      };
  } else if (user) {
    activeAccount = { username: user.username, avatarUrl: user.avatarUrl };
  }

  return (
    <Element
      as="aside"
      {...props}
      css={css({
        borderRight: '1px solid',
        borderColor: 'sideBar.border',
        width: [0, 0, SIDEBAR_WIDTH],
        flexShrink: 0,
        display: ['none', 'none', 'block'],
      })}
    >
      <List>
        <ListAction gap={2} css={{ padding: 0 }}>
          {user && (
            <Menu>
              <Stack
                as={Menu.Button}
                justify="space-between"
                align="center"
                css={css({
                  width: '100%',
                  height: 8,
                })}
              >
                <Stack gap={2} align="center">
                  <Avatar user={activeAccount} css={css({ size: 5 })} />
                  <Text size={4} weight="normal">
                    {activeAccount.username}
                  </Text>
                </Stack>
                <Icon name="caret" size={8} />
              </Stack>
              <Menu.List css={{ width: SIDEBAR_WIDTH }}>
                <Menu.Item
                  css={{ textAlign: 'left' }}
                  onSelect={() => actions.dashboard.setActiveTeam({ id: null })}
                >
                  <Text size={3}>{user.username} (Personal)</Text>
                </Menu.Item>
                {dashboard.teams.map(team => (
                  <Menu.Item
                    as={Menu.Item}
                    css={{ textAlign: 'left' }}
                    onSelect={() =>
                      actions.dashboard.setActiveTeam({ id: team.id })
                    }
                  >
                    <Text size={3}>{team.name}</Text>
                  </Menu.Item>
                ))}
              </Menu.List>
            </Menu>
          )}
        </ListAction>
        <ListAction>
          <Link to="start" as={RouterLink}>
            Start
          </Link>
        </ListAction>
        <ListAction>
          <Link to="drafts" as={RouterLink}>
            Drafts
          </Link>
        </ListAction>
        <ListAction>
          <Link to="recent" as={RouterLink}>
            Recent
          </Link>
        </ListAction>
        <ListAction>
          <Link to="all" as={RouterLink}>
            All Sandboxes
          </Link>
        </ListAction>
        <ListAction>
          <Link to="templates" as={RouterLink}>
            Templates
          </Link>
        </ListAction>
        <ListAction>
          <Link to="deleted" as={RouterLink}>
            Recently Deleted
          </Link>
        </ListAction>
      </List>
    </Element>
  );
};
