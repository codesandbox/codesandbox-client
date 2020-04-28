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

// I hate this! but we need this until I refactor how
// components are structured — Sid
// https://linear.app/issue/CSB-118
const linkStyles = {
  width: '100%',
  height: '100%',
  display: 'flex',
  alignItems: 'center',
  paddingLeft: 24,
  paddingRight: 8,
};

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
      <List css={css({ '> li': { height: 10 } })}>
        <ListAction gap={2}>
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

        <ListAction align="center" css={css({ paddingX: 0 })}>
          <Link as={RouterLink} to="start" style={linkStyles}>
            <Icon name="file" marginRight={2} />
            Start
          </Link>
        </ListAction>
        <ListAction align="center" css={css({ paddingX: 0 })}>
          <Link as={RouterLink} to="drafts" style={linkStyles}>
            <Icon name="file" marginRight={2} />
            Drafts
          </Link>
        </ListAction>
        <ListAction align="center" css={css({ paddingX: 0 })}>
          <Link as={RouterLink} to="recent" style={linkStyles}>
            <Icon name="clock" marginRight={2} />
            Recent
          </Link>
        </ListAction>
        <ListAction align="center" css={css({ paddingX: 0 })}>
          <Link as={RouterLink} to="all" style={linkStyles}>
            <Icon name="folder" marginRight={2} />
            All Sandboxes
          </Link>
        </ListAction>
        <ListAction align="center" css={css({ paddingX: 0 })}>
          <Link as={RouterLink} to="templates" style={linkStyles}>
            <Icon name="star" marginRight={2} />
            Templates
          </Link>
        </ListAction>
        <ListAction align="center" css={css({ paddingX: 0 })}>
          <Link as={RouterLink} to="deleted" style={linkStyles}>
            <Icon name="trash" marginRight={2} />
            Recently Deleted
          </Link>
        </ListAction>
      </List>
    </Element>
  );
};
