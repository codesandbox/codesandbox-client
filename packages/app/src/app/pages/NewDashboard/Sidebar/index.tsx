import React, { useState } from 'react';
import { Link as RouterLink, useLocation, useHistory } from 'react-router-dom';
import { useDrop } from 'react-dnd';
import { orderBy } from 'lodash-es';
import { join, dirname } from 'path';
import { useOvermind } from 'app/overmind';
import { motion, AnimatePresence } from 'framer-motion';
import { ESC, ENTER } from '@codesandbox/common/lib/utils/keycodes';
import track from '@codesandbox/common/lib/utils/analytics';
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
  Input,
} from '@codesandbox/components';
import css from '@styled-system/css';
import merge from 'deepmerge';
import { TeamAvatar } from './TeamAvatar';
import { ContextMenu } from './ContextMenu';

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

  const inTeamContext =
    activeAccount && user && activeAccount.username !== user.username;

  const folders = dashboard.allCollections || [];

  // context menu for folders
  const [menuVisible, setMenuVisibility] = React.useState(true);
  const [menuPosition, setMenuPosition] = React.useState({ x: null, y: null });
  const [menuFolder, setMenuFolder] = React.useState(null);
  const [isRenamingFolder, setRenamingFolder] = React.useState(false);
  const [newFolderPath, setNewFolderPath] = React.useState(null);

  const menuState = {
    menuFolder,
    setMenuFolder,
    setMenuVisibility,
    menuPosition,
    setMenuPosition,
    isRenamingFolder,
    setRenamingFolder,
    newFolderPath,
    setNewFolderPath,
  };

  const history = useHistory();

  return (
    <SidebarContext.Provider value={{ onSidebarToggle, menuState }}>
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
                  <Menu.List
                    css={css({
                      width: SIDEBAR_WIDTH,
                      marginLeft: 4,
                      marginTop: '-4px',
                      backgroundColor: 'grays.600',
                    })}
                  >
                    <Menu.Item
                      css={css({
                        height: 10,
                        textAlign: 'left',
                        backgroundColor: !inTeamContext
                          ? 'grays.500'
                          : 'transparent',
                      })}
                      style={{ paddingLeft: 8 }}
                      onSelect={() => {
                        actions.dashboard.setActiveTeam({ id: null });
                        track('Dashboard - Change workspace', {
                          dashboardVersion: 2,
                        });
                      }}
                    >
                      <Stack align="center" gap={2}>
                        <Avatar user={user} css={css({ size: 6 })} />
                        <Text size={3}>{user.username} (Personal)</Text>
                      </Stack>
                    </Menu.Item>
                    {dashboard.teams.map(team => (
                      <Stack
                        as={Menu.Item}
                        key={team.id}
                        align="center"
                        gap={2}
                        css={css({
                          height: 10,
                          textAlign: 'left',
                          backgroundColor:
                            activeAccount.username === team.name
                              ? 'grays.500'
                              : 'transparent',
                        })}
                        style={{ paddingLeft: 8 }}
                        onSelect={() =>
                          actions.dashboard.setActiveTeam({ id: team.id })
                        }
                      >
                        <TeamAvatar name={team.name} size="small" />
                        <Text size={3}>{team.name}</Text>
                      </Stack>
                    ))}
                    <Menu.Divider />
                    <Stack
                      as={Menu.Item}
                      align="center"
                      gap={2}
                      css={css({
                        height: 10,
                        textAlign: 'left',
                      })}
                      style={{ paddingLeft: 8 }}
                      onSelect={() =>
                        history.push('/new-dashboard/settings/new')
                      }
                    >
                      <Stack
                        justify="center"
                        align="center"
                        css={css({
                          size: 6,
                          borderRadius: 'small',
                          border: '1px solid',
                          borderColor: 'avatar.border',
                        })}
                      >
                        <Icon name="plus" size={10} />
                      </Stack>
                      <Text size={3} variant="muted">
                        Create a new workspace
                      </Text>
                    </Stack>
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
          {inTeamContext ? null : (
            <RowItem name="Recent" path="recent" icon="clock" />
          )}
          <RowItem
            name={!inTeamContext ? 'Drafts' : 'My Drafts'}
            path="/drafts"
            icon="file"
          />

          {inTeamContext ? <Menu.Divider /> : null}

          <NestableRowItem
            name="All sandboxes"
            path=""
            folders={[
              ...folders,
              ...(newFolderPath ? [{ path: newFolderPath, name: '' }] : []),
            ]}
          />

          {inTeamContext ? (
            <RowItem name="Recently Modified" path="recent" icon="clock" />
          ) : null}
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
      <ContextMenu
        visible={menuVisible}
        setVisibility={setMenuVisibility}
        position={menuPosition}
        folder={menuFolder}
        setRenaming={setRenamingFolder}
        setNewFolderPath={setNewFolderPath}
      />
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
  flexShrink: 0,
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

const RowItem = ({
  name,
  path,
  icon,
  setFoldersVisibility = null,
  ...props
}) => {
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
  const history = useHistory();

  /** Toggle nested folders when user
   * is drags an item over a folder after a treshold
   * We open All sandboxes instantly because that's the root
   * and you can't drop anything in it
   */
  const HOVER_THRESHOLD = name === 'All sandboxes' ? 0 : 500; // ms
  const isOverCache = React.useRef(false);

  React.useEffect(() => {
    if (!isOver) isOverCache.current = false;
    else isOverCache.current = true;

    const handler = () => {
      if (isOverCache.current && setFoldersVisibility) {
        setFoldersVisibility(true);
      }
    };

    const timer = window.setTimeout(handler, HOVER_THRESHOLD);
    return () => window.clearTimeout(timer);
  }, [isOver, setFoldersVisibility, HOVER_THRESHOLD]);

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
            a: {
              ':focus': {
                // focus state is handled by ListAction:focus-within
                outline: 'none',
              },
            },
          },
          props.style || {}
        )
      )}
    >
      {props.children || (
        <Link
          as={RouterLink}
          to={linkTo}
          style={linkStyles}
          onKeyDown={event => {
            if (event.keyCode === ENTER) {
              history.push(linkTo, { focus: 'FIRST_ITEM' });
            }
          }}
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

const NestableRowItem = ({ name, path, folders }) => {
  const { actions } = useOvermind();

  const {
    menuState: {
      menuFolder,
      setMenuFolder,
      setMenuVisibility,
      setMenuPosition,
      isRenamingFolder,
      setRenamingFolder,
      newFolderPath,
      setNewFolderPath,
    },
  } = React.useContext(SidebarContext);

  const [foldersVisible, setFoldersVisibility] = React.useState(false);

  let hasNewNestedFolder = false;
  if (newFolderPath !== null) {
    const newFolderParent = newFolderPath.replace('/__NEW__', '');
    if (name === 'All sandboxes') {
      hasNewNestedFolder = true;
    } else if (newFolderParent.length && path.includes(newFolderParent)) {
      hasNewNestedFolder = true;
    }
  }

  React.useEffect(() => {
    if (hasNewNestedFolder) setFoldersVisibility(true);
  }, [hasNewNestedFolder]);

  const onContextMenu = event => {
    event.preventDefault();
    setMenuVisibility(true);
    setMenuFolder({ name, path });
    setMenuPosition({ x: event.clientX, y: event.clientY });
  };

  let subFolders;
  if (name === 'All sandboxes') {
    subFolders = folders.filter(folder => {
      if (folder.path === newFolderPath) {
        return newFolderPath.replace('/__NEW__', '') === '';
      }
      return !folder.parent;
    });
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

  /* Rename logic */
  const isRenaming = isRenamingFolder && menuFolder.path === path;
  const isNewFolder = newFolderPath === path;
  const [newName, setNewName] = React.useState(name);

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewName(event.target.value);
  };
  const onInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.keyCode === ESC) {
      // Reset value and exit without saving
      setNewName(name);
      setRenamingFolder(false);
      setNewFolderPath(null);
    }
  };

  const onSubmit = async (event?: React.FormEvent<HTMLFormElement>) => {
    if (event) event.preventDefault();

    if (name === newName) {
      // nothing to do here
    } else if (isNewFolder) {
      if (newName) {
        const folderPath = path.replace('__NEW__', newName);
        await actions.dashboard.createFolder(folderPath);
        track('Dashboard - Create Directory', {
          source: 'Sidebar',
          dashboardVersion: 2,
          folderPath,
        });
      }
    } else {
      await actions.dashboard.renameFolder({
        path,
        newPath: join(dirname(path), newName),
      });
      track('Dashboard - Rename Folder', {
        source: 'Sidebar',
        dashboardVersion: 2,
      });
    }

    setNewFolderPath(null);
    return setRenamingFolder(false);
  };

  const onInputBlur = () => {
    // save value when you click outside or tab away
    setRenamingFolder(false);
    setNewFolderPath(null);
    onSubmit();
  };

  return (
    <>
      <RowItem
        name={name}
        path={path}
        icon="folder"
        style={{ height: nestingLevel ? 8 : 10 }}
        setFoldersVisibility={setFoldersVisibility}
      >
        <Link
          onClick={() => history.push('/new-dashboard/all' + path)}
          onContextMenu={onContextMenu}
          onKeyDown={event => {
            if (event.keyCode === ENTER && !isRenaming && !isNewFolder) {
              history.push('/new-dashboard/all' + path, {
                focus: 'FIRST_ITEM',
              });
            }
          }}
          tabIndex={0}
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
            <Element as="span" css={css({ width: 5, flexShrink: 0 })} />
          )}

          <Stack align="center" gap={3} css={{ width: 'calc(100% - 28px)' }}>
            <Stack
              as="span"
              css={css({ width: 4 })}
              align="center"
              justify="center"
            >
              <Icon name="folder" />
            </Stack>
            {isRenaming || isNewFolder ? (
              <form onSubmit={onSubmit}>
                <Input
                  autoFocus
                  value={newName}
                  onChange={onChange}
                  onKeyDown={onInputKeyDown}
                  onBlur={onInputBlur}
                  css={css({ fontSize: 4 })}
                />
              </form>
            ) : (
              <Text maxWidth="100%" css={{ userSelect: 'none' }}>
                {name}
              </Text>
            )}
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
