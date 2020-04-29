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
  paddingLeft: 8,
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
        <ListAction gap={2} css={css({ paddingX: 0 })}>
          {user && (
            <Menu>
              <Stack
                as={Menu.Button}
                justify="space-between"
                align="center"
                css={css({
                  width: '100%',
                  height: '100%',
                  paddingLeft: 2,
                  borderBottom: '1px solid',
                  borderColor: 'sideBar.border',
                  borderRadius: 0,
                })}
              >
                <Stack as="span" align="center">
                  <Stack
                    as="span"
                    css={css({ width: 10 })}
                    align="center"
                    justify="center"
                  >
                    <Avatar user={activeAccount} css={css({ size: 6 })} />
                  </Stack>
                  <Text size={4} weight="normal">
                    {activeAccount.username}
                  </Text>
                </Stack>
                <Icon name="caret" size={8} />
              </Stack>
              <Menu.List style={{ width: SIDEBAR_WIDTH, borderRadius: 0 }}>
                <Menu.Item
                  css={{ textAlign: 'left' }}
                  onSelect={() => actions.dashboard.setActiveTeam({ id: null })}
                >
                  <Stack align="center">
                    <Stack
                      as="span"
                      css={css({ width: 8 })}
                      align="center"
                      justify="center"
                    >
                      <Avatar user={user} css={css({ size: 5 })} />
                    </Stack>
                    <Text
                      size={3}
                      weight={
                        activeAccount.username === user.username
                          ? 'semibold'
                          : 'normal'
                      }
                    >
                      {user.username} (Personal)
                    </Text>
                  </Stack>
                </Menu.Item>
                {dashboard.teams.map(team => (
                  <Menu.Item
                    key={team.id}
                    as={Menu.Item}
                    css={{ textAlign: 'left' }}
                    onSelect={() =>
                      actions.dashboard.setActiveTeam({ id: team.id })
                    }
                  >
                    <Stack align="center">
                      <Stack
                        as="span"
                        css={css({ width: 8 })}
                        align="center"
                        justify="center"
                      >
                        <Avatar
                          user={{
                            username: team.name,
                            avatarUrl: 'https://github.com/github.png',
                          }}
                          css={css({ size: 5 })}
                        />
                      </Stack>
                      <Text
                        size={3}
                        weight={
                          activeAccount.username === team.name
                            ? 'semibold'
                            : 'normal'
                        }
                      >
                        {team.name}
                      </Text>
                    </Stack>
                  </Menu.Item>
                ))}
              </Menu.List>
            </Menu>
          )}
        </ListAction>

        <ListAction align="center" css={css({ paddingX: 0 })}>
          <Link as={RouterLink} to="/new-dashboard/start" style={linkStyles}>
            <Stack
              as="span"
              css={css({ width: 10 })}
              align="center"
              justify="center"
            >
              <Icon name="box" />
            </Stack>
            Start
          </Link>
        </ListAction>
        <ListAction align="center" css={css({ paddingX: 0 })}>
          <Link as={RouterLink} to="/new-dashboard/drafts" style={linkStyles}>
            <Stack
              as="span"
              css={css({ width: 10 })}
              align="center"
              justify="center"
            >
              <Icon name="file" />
            </Stack>
            Drafts
          </Link>
        </ListAction>
        <ListAction align="center" css={css({ paddingX: 0 })}>
          <Link as={RouterLink} to="/new-dashboard/recent" style={linkStyles}>
            <Stack
              as="span"
              css={css({ width: 10 })}
              align="center"
              justify="center"
            >
              <Icon name="clock" />
            </Stack>
            Recent
          </Link>
        </ListAction>
        <ListAction align="center" css={css({ paddingX: 0 })}>
          <Link as={RouterLink} to="/new-dashboard/all" style={linkStyles}>
            <Stack
              as="span"
              css={css({ width: 10 })}
              align="center"
              justify="center"
            >
              <Icon name="folder" />
            </Stack>
            All Sandboxes
          </Link>
        </ListAction>
        <ListAction align="center" css={css({ paddingX: 0 })}>
          <Link
            as={RouterLink}
            to="/new-dashboard/templates"
            style={linkStyles}
          >
            <Stack
              as="span"
              css={css({ width: 10 })}
              align="center"
              justify="center"
            >
              <Icon name="star" />
            </Stack>
            Templates
          </Link>
        </ListAction>
        <ListAction align="center" css={css({ paddingX: 0 })}>
          <Link as={RouterLink} to="/new-dashboard/deleted" style={linkStyles}>
            <Stack
              as="span"
              css={css({ width: 10 })}
              align="center"
              justify="center"
            >
              <Icon name="trash" />
            </Stack>
            Recently Deleted
          </Link>
        </ListAction>
      </List>
    </Element>
  );
};
