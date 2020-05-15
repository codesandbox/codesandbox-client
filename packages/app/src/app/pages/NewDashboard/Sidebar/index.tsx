import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { useDrop } from 'react-dnd';
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
  IconButton,
} from '@codesandbox/components';
import css from '@styled-system/css';

export const SIDEBAR_WIDTH = 240;

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

  React.useEffect(() => {
    actions.dashboard.getAllFolders();
  }, [actions.dashboard]);

  const folders = dashboard.allCollections || [];
  const [foldersVisible, setFoldersVisibility] = React.useState(false);

  return (
    <Element as="aside" {...props}>
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
        <RowItem name="Start" path="start" icon="box" />
        <RowItem name="Recent" path="recent" icon="clock" />
        <RowItem name="Drafts" path="drafts" icon="file" />

        <ListAction
          justify="space-between"
          align="center"
          css={css({
            paddingX: 0,
            button: { opacity: 0 },
            ':hover, :focus-within': { button: { opacity: 1 } },
          })}
        >
          <IconButton
            name="caret"
            size={8}
            title="Toggle folders"
            onClick={() => setFoldersVisibility(!foldersVisible)}
            css={css({
              width: 5,
              height: '100%',
              borderRadius: 0,
              svg: {
                transform: foldersVisible ? 'rotate(0deg)' : 'rotate(-90deg)',
                transition: 'transform ease-in-out',
                transitionDuration: theme => theme.speeds[2],
              },
            })}
          />
          <Link
            as={RouterLink}
            to="/new-dashboard/all"
            style={{ ...linkStyles, paddingLeft: 0 }}
          >
            <Stack align="center" gap={2}>
              <Stack
                as="span"
                css={css({ width: 4 })}
                align="center"
                justify="center"
              >
                <Icon name="folder" />
              </Stack>
              <Text>All Sandboxes</Text>
            </Stack>
          </Link>
        </ListAction>

        {foldersVisible &&
          folders
            .filter(isTopLevelFolder)
            .map(folder => (
              <RowItem
                key={folder.path}
                name={folder.name}
                path={'all' + folder.path}
                icon="folder"
                isNested
              />
            ))}

        <RowItem name="Templates" path="templates" icon="star" />
        <RowItem name="Recently Deleted" path="deleted" icon="trash" />
        <RowItem name="Settings (temp)" path="settings" icon="gear" />
      </List>
    </Element>
  );
};

const isTopLevelFolder = folder => !folder.parent;

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

const canNotAcceptSandboxes = ['start', 'recent', 'all', 'settings'];

const RowItem = ({ name, path, icon, isNested = false }) => {
  const [{ canDrop, isOver, isDragging }, dropRef] = useDrop({
    accept: canNotAcceptSandboxes.includes(path) ? 'nope' : 'sandbox',
    drop: () => ({ path: path.replace('all', '') }),
    collect: monitor => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
      isDragging: !!monitor.getItem(),
    }),
  });

  return (
    <ListAction
      ref={dropRef}
      align="center"
      css={css({
        paddingX: 0,
        paddingLeft: isNested ? 4 : 0,
        opacity: isDragging && !canDrop ? 0.25 : 1,
        color:
          isDragging && canDrop ? 'list.hoverForeground' : 'list.foreground',
        backgroundColor:
          canDrop && isOver ? 'list.hoverBackground' : 'transparent',
        transition: 'all ease-in',
        transitionDuration: theme => theme.speeds[4],
      })}
      style={{
        height: isNested ? 32 : 40,
      }}
    >
      <Link as={RouterLink} to={`/new-dashboard/${path}`} style={linkStyles}>
        <Stack
          as="span"
          css={css({ width: 10 })}
          align="center"
          justify="center"
        >
          <Icon name={icon} />
        </Stack>
        {name}
      </Link>
    </ListAction>
  );
};
