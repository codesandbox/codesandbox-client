import React, { useState } from 'react';
import { Link as RouterLink, useLocation, useHistory } from 'react-router-dom';
import { useDrop } from 'react-dnd';
import { orderBy } from 'lodash-es';
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
import { TeamAvatar } from './TeamAvatar';

export const SIDEBAR_WIDTH = 240;

const SidebarContext = React.createContext(null);

export const Sidebar = ({ visible, onSidebarToggle, ...props }) => {
  const {
    state: { dashboard, user },
    actions,
  } = useOvermind();
  const [activeAccount, setActiveAccount] = useState({
    username: null,
    avatarUrl: null,
  });

  React.useEffect(() => {
    actions.dashboard.getTeams();
  }, [actions.dashboard, user]);

  React.useEffect(() => {
    actions.dashboard.getAllFolders();
  }, [actions.dashboard, dashboard.activeTeam]);

  React.useEffect(() => {
    if (dashboard.activeTeam) {
      const team = dashboard.teams.find(
        ({ id }) => id === dashboard.activeTeam
      );

      if (team) setActiveAccount({ username: team.name, avatarUrl: null });
    } else if (user) {
      setActiveAccount({
        username: user.username,
        avatarUrl: user.avatarUrl,
      });
    }
  }, [dashboard.activeTeam, dashboard.activeTeamInfo, dashboard.teams, user]);

  const folders = dashboard.allCollections || [];

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
          overflowY: 'auto',
          overflowX: 'hidden',
          ...props.css,
        })}
      >
        <List>
          <ListItem gap={2} css={css({ paddingX: 0, height: 10 })}>
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
                        {activeAccount.avatarUrl ? (
                          <Avatar user={activeAccount} css={css({ size: 6 })} />
                        ) : (
                          <TeamAvatar name={activeAccount.username} />
                        )}
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
                            <TeamAvatar name={team.name} size="small" />
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
          <RowItem name="Home" path="home" icon="box" />
          <RowItem name="Recent" path="recent" icon="clock" />
          <RowItem name="Drafts" path="/drafts" icon="file" />

          <NestableRowItem name="All sandboxes" path="" folders={folders} />

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

const canNotAcceptSandboxes = ['home', 'recent', 'all'];
const canNotAcceptFolders = ['home', 'recent', '/drafts', 'templates'];

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

const RowItem = ({ name, path, icon, ...props }) => {
  const accepts = [];
  if (!canNotAcceptSandboxes.includes(path)) accepts.push('sandbox');
  if (!canNotAcceptFolders.includes(path)) accepts.push('folder');

  const [{ canDrop, isOver, isDragging }, dropRef] = useDrop({
    accept: accepts,
    drop: (item, monitor) => ({ path, isSamePath: isSamePath(item, path) }),
    collect: monitor => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop() && !isSamePath(monitor.getItem(), path),
      isDragging: !!monitor.getItem(),
    }),
  });

  const { onSidebarToggle } = React.useContext(SidebarContext);

  let linkTo: string;
  if (path === '/drafts') linkTo = '/new-dashboard/drafts';
  else linkTo = '/new-dashboard/' + path;

  const location = useLocation();
  const isCurrentLink = linkTo === location.pathname;

  return (
    <ListAction
      ref={dropRef}
      align="center"
      onClick={onSidebarToggle}
      css={css(
        merge(
          {
            height: 10,
            paddingX: 0,
            opacity: isDragging && !canDrop ? 0.25 : 1,
            color:
              isCurrentLink || (isDragging && canDrop)
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
    >
      {props.children || (
        <Link as={RouterLink} to={linkTo} style={linkStyles}>
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

const NestableRowItem = ({ name, path, folders }) => {
  const [foldersVisible, setFoldersVisibility] = React.useState(false);

  let subFolders;
  if (name === 'All sandboxes') {
    subFolders = folders.filter(folder => !folder.parent);
  } else {
    subFolders = folders.filter(folder => {
      const parentPath = folder.path
        .split('/')
        .slice(0, -1)
        .join('/');
      return parentPath === path;
    });
  }

  const nestingLevel = path.split('/').length - 1;
  const history = useHistory();

  return (
    <>
      <RowItem
        name={path}
        path={path}
        icon="folder"
        style={{
          height: nestingLevel ? 8 : 10,
          button: { opacity: 0 },
          ':hover, :focus-within': { button: { opacity: 1 } },
        }}
      >
        <Link
          href="#"
          onClick={() => history.push('/new-dashboard/all' + path)}
          style={{
            ...linkStyles,
            paddingLeft: nestingLevel * 16,
          }}
        >
          {subFolders.length ? (
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
          ) : (
            <Element as="span" css={css({ width: 5 })} />
          )}
          <Stack align="center" gap={3}>
            <Stack
              as="span"
              css={css({ width: 4 })}
              align="center"
              justify="center"
            >
              <Icon name="folder" />
            </Stack>
            <Text>{name}</Text>
          </Stack>
        </Link>
      </RowItem>

      <AnimatePresence>
        {foldersVisible && (
          <motion.ul
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            transition={{ duration: 0.2 }}
            exit={{ height: 0, opacity: 0, transition: { duration: 0.15 } }}
            style={{ paddingLeft: 0 }}
          >
            {orderBy(subFolders, 'name')
              .sort(a => (a.path === '/drafts' ? -1 : 1))
              .map(folder => (
                <NestableRowItem
                  key={folder.path}
                  name={folder.name}
                  path={folder.path}
                  folders={folders}
                />
              ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </>
  );
};
