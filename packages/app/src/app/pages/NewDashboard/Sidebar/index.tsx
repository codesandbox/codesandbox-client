import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { useDrop } from 'react-dnd';
import { useOvermind } from 'app/overmind';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Element,
  List,
  ListAction,
  ListItem,
  Link,
  Avatar,
  Text,
  Menu,
  Stack,
  Icon,
  IconButton,
  Button,
} from '@codesandbox/components';
import css from '@styled-system/css';
import merge from 'deepmerge';

export const SIDEBAR_WIDTH = 240;

const SidebarContext = React.createContext(null);

export const Sidebar = ({ visible, onSidebarToggle, ...props }) => {
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
    activeAccount = {
      username: user.username,
      avatarUrl: user.avatarUrl,
    };
  }

  React.useEffect(() => {
    actions.dashboard.getAllFolders();
  }, [actions.dashboard]);

  const folders = dashboard.allCollections || [];
  const [foldersVisible, setFoldersVisibility] = React.useState(false);

  return (
    <SidebarContext.Provider value={{ onSidebarToggle }}>
      <Stack
        as={motion.aside}
        direction="vertical"
        justify="space-between"
        animate={{
          left: visible ? 0 : -1 * SIDEBAR_WIDTH,
          transition: { duration: visible ? 0.2 : 0.15 },
        }}
        {...props}
        css={css({
          borderRight: '1px solid',
          borderColor: 'sideBar.border',
          backgroundColor: 'sideBar.background',
          width: SIDEBAR_WIDTH,
          flexShrink: 0,
          zIndex: 3,
          ...props.css,
        })}
      >
        <List css={css({ '> li': { height: 10 } })}>
          <ListItem gap={2} css={css({ paddingX: 0 })}>
            {user && (
              <Stack
                css={css({
                  width: '100%',
                  height: '100%',
                  borderBottom: '1px solid',
                  borderColor: 'sideBar.border',
                })}
              >
                <Menu>
                  <Stack
                    as={Menu.Button}
                    justify="space-between"
                    align="center"
                    css={css({
                      width: SIDEBAR_WIDTH - 32,
                      height: '100%',
                      paddingLeft: 2,
                      borderRadius: 0,
                      ':hover, :focus-within': {
                        backgroundColor: 'sideBar.hoverBackground',
                      },
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
                      <Text size={4} weight="normal" maxWidth={140}>
                        {activeAccount.username}
                      </Text>
                    </Stack>
                    <Icon name="caret" size={8} />
                  </Stack>
                  <Menu.List style={{ width: SIDEBAR_WIDTH, borderRadius: 0 }}>
                    <Menu.Item
                      css={{ textAlign: 'left' }}
                      onSelect={() =>
                        actions.dashboard.setActiveTeam({ id: null })
                      }
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

                <Link as={RouterLink} to="/new-dashboard/settings">
                  <IconButton
                    name="gear"
                    size={8}
                    title="Settings"
                    css={css({ width: 8, height: '100%', borderRadius: 0 })}
                  />
                </Link>
              </Stack>
            )}
          </ListItem>
          <RowItem name="Start" path="start" icon="box" />
          <RowItem name="Recent" path="recent" icon="clock" />
          <RowItem name="Drafts" path="drafts" icon="file" />

          <RowItem
            name="All sandboxes"
            path="all"
            icon="folder"
            style={{
              button: { opacity: 0 },
              ':hover, :focus-within': { button: { opacity: 1 } },
            }}
          >
            <IconButton
              name="caret"
              size={8}
              title="Toggle folders"
              onClick={event => {
                setFoldersVisibility(!foldersVisible);
                event.stopPropagation();
              }}
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
          </RowItem>

          {foldersVisible &&
            folders
              .filter(isTopLevelFolder)
              .map(folder => (
                <RowItem
                  key={folder.path}
                  name={folder.name}
                  path={folder.path}
                  icon="folder"
                  isNested
                />
              ))}

          <RowItem name="Templates" path="templates" icon="star" />
          <RowItem name="Recently Deleted" path="deleted" icon="trash" />
        </List>
        <Element margin={4}>
          <Button
            as={RouterLink}
            to="/new-dashboard/settings/new"
            variant="secondary"
          >
            <Icon name="plus" size={10} marginRight={1} />
            Create New Workspace
          </Button>
        </Element>
      </Stack>
      <AnimatePresence>
        {visible && (
          <Element
            as={motion.div}
            onClick={onSidebarToggle}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.9, transition: { duration: 0.2 } }}
            exit={{ opacity: 0, transition: { duration: 0.15 } }}
            css={css({
              display: ['block', 'block', 'none'], // hide on biggest breakpoint
              position: 'absolute',
              backgroundColor: 'sideBar.background',
              height: '100vh',
              width: '100vw',
              zIndex: 2,
            })}
          />
        )}
      </AnimatePresence>
    </SidebarContext.Provider>
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

const canNotAcceptSandboxes = ['start', 'recent', 'all'];
const canNotAcceptFolders = ['start', 'recent', 'drafts', 'templates'];

const isSamePath = (draggedItem, dropPath) => {
  if (!draggedItem) return false;

  if (
    draggedItem.type === 'sandbox' &&
    draggedItem.collectionPath === dropPath
  ) {
    return true;
  }

  if (
    draggedItem.type === 'folder' &&
    (draggedItem.path === dropPath || draggedItem.parent === dropPath)
  ) {
    return true;
  }

  return false;
};

const RowItem = ({ name, path, icon, isNested = false, ...props }) => {
  const accepts = [];
  if (!canNotAcceptSandboxes.includes(path)) accepts.push('sandbox');
  if (!canNotAcceptFolders.includes(path)) accepts.push('folder');

  const [{ canDrop, isOver, isDragging }, dropRef] = useDrop({
    accept: accepts,
    drop: () => ({ path }),
    collect: monitor => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop() && !isSamePath(monitor.getItem(), path),
      isDragging: !!monitor.getItem(),
    }),
  });

  const { onSidebarToggle } = React.useContext(SidebarContext);

  return (
    <ListAction
      ref={dropRef}
      align="center"
      onClick={onSidebarToggle}
      css={css(
        merge(
          {
            paddingX: 0,
            paddingLeft: isNested ? 4 : 0,
            opacity: isDragging && !canDrop ? 0.25 : 1,
            color:
              isDragging && canDrop
                ? 'list.hoverForeground'
                : 'list.foreground',
            backgroundColor:
              canDrop && isOver ? 'list.hoverBackground' : 'transparent',
            transition: 'all ease-in',
            transitionDuration: theme => theme.speeds[4],
          },
          props.style || {}
        )
      )}
      style={{ height: isNested ? 32 : 40 }}
    >
      {props.children || (
        <Link
          as={RouterLink}
          to={`/new-dashboard${isNested ? '/all' : '/'}${path}`}
          style={linkStyles}
        >
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
      )}
    </ListAction>
  );
};
