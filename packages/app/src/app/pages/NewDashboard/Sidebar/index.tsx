import React, { useState } from 'react';
import { Link as RouterLink, useLocation, useHistory } from 'react-router-dom';
import { useDrop } from 'react-dnd';
import { orderBy } from 'lodash-es';
import { join, dirname } from 'path';
import { useOvermind } from 'app/overmind';
import { motion, AnimatePresence } from 'framer-motion';
import { dashboard as dashboardUrls } from '@codesandbox/common/lib/utils/url-generator';
import { ESC, ENTER } from '@codesandbox/common/lib/utils/keycodes';
import track from '@codesandbox/common/lib/utils/analytics';
import {
  Element,
  List,
  ListAction,
  ListItem,
  Link,
  Text,
  Menu,
  Stack,
  Icon,
  IconButton,
  Button,
  Input,
  IconNames,
} from '@codesandbox/components';
import css from '@styled-system/css';
import merge from 'deepmerge';
import { ContextMenu } from './ContextMenu';
import { DashboardBaseFolder } from '../types';
import { Position } from '../Components/Selection';
import { SIDEBAR_WIDTH } from './constants';
import { WorkspaceSwitcher } from './WorkspaceSwitcher';

const SidebarContext = React.createContext(null);

interface SidebarProps {
  visible: boolean;
  onSidebarToggle: () => void;
  css?: any;
  style?: React.CSSProperties;
  id?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({
  visible,
  onSidebarToggle,
  ...props
}) => {
  const { state, actions } = useOvermind();
  const [activeAccount, setActiveAccount] = useState<{
    username: string | null;
    avatarUrl: string | null;
  }>({
    username: null,
    avatarUrl: null,
  });
  const { dashboard, user, activeTeam } = state;

  React.useEffect(() => {
    actions.dashboard.getTeams();
  }, [actions.dashboard, user?.id]);

  React.useEffect(() => {
    actions.dashboard.getAllFolders();
  }, [actions.dashboard, state.activeTeam]);

  React.useEffect(() => {
    if (state.activeTeam) {
      const team = dashboard.teams.find(({ id }) => id === state.activeTeam);

      if (team) setActiveAccount({ username: team.name, avatarUrl: null });
    } else if (user) {
      setActiveAccount({
        username: user.username,
        avatarUrl: user.avatarUrl,
      });
    }
  }, [state.activeTeam, state.activeTeamInfo, dashboard.teams, user]);

  const inTeamContext =
    activeAccount && user && activeAccount.username !== user.username;

  const folders = dashboard.allCollections || [];

  // context menu for folders
  const [menuVisible, setMenuVisibility] = React.useState(true);
  const [menuPosition, setMenuPosition] = React.useState<Position>({
    x: null,
    y: null,
  });
  const [
    menuFolder,
    setMenuFolder,
  ] = React.useState<DashboardBaseFolder | null>(null);
  const [isRenamingFolder, setRenamingFolder] = React.useState(false);
  const [newFolderPath, setNewFolderPath] = React.useState<string | null>(null);

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
            <WorkspaceSwitcher
              activeAccount={activeAccount}
              inTeamContext={inTeamContext}
            />
          </ListItem>
          <RowItem
            name="Home"
            path={dashboardUrls.home(activeTeam)}
            icon="box"
          />
          {inTeamContext ? null : (
            <RowItem
              name="Recent"
              path={dashboardUrls.recents(activeTeam)}
              icon="clock"
            />
          )}
          <RowItem
            name="My Drafts"
            path={dashboardUrls.drafts(activeTeam)}
            icon="file"
          />

          {inTeamContext ? <Menu.Divider /> : null}

          <NestableRowItem
            name="All Sandboxes"
            path={dashboardUrls.allSandboxes('/', activeTeam)}
            folderPath="/"
            folders={[
              ...folders,
              ...(newFolderPath
                ? [{ path: newFolderPath, name: '', parent: null }]
                : []),
            ]}
          />

          {inTeamContext ? (
            <RowItem
              name="Recently Modified"
              path={dashboardUrls.recents(activeTeam)}
              icon="clock"
            />
          ) : null}
          <RowItem
            name="Templates"
            path={dashboardUrls.templates(activeTeam)}
            icon="star"
          />
          <RowItem
            name="Recently Deleted"
            path={dashboardUrls.deleted(activeTeam)}
            icon="trash"
          />
        </List>
        <Element margin={4}>
          <Button
            as={RouterLink}
            to={dashboardUrls.createWorkspace()}
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
        activeTeam={activeTeam}
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

const canNotAcceptSandboxes = ['/home', '/recent'];
const canNotAcceptFolders = ['/home', '/recent', '/drafts', '/templates'];

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

interface RowItemProps {
  name: string;
  path: string;
  icon: IconNames;
  setFoldersVisibility?: (val: boolean) => void;
  folderPath?: string;
  style?: React.CSSProperties;
}

const RowItem: React.FC<RowItemProps> = ({
  name,
  path,
  folderPath = path,
  icon,
  setFoldersVisibility = null,
  ...props
}) => {
  const accepts = [];
  if (!canNotAcceptSandboxes.includes(path)) accepts.push('sandbox');
  if (!canNotAcceptFolders.includes(path)) accepts.push('folder');

  const usedPath = folderPath || path;
  const [{ canDrop, isOver, isDragging }, dropRef] = useDrop({
    accept: accepts,
    drop: (item, monitor) => ({
      path: usedPath,
      isSamePath: isSamePath(item, usedPath),
    }),
    collect: monitor => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop() && !isSamePath(monitor.getItem(), usedPath),
      isDragging: !!monitor.getItem(),
    }),
  });

  const { onSidebarToggle } = React.useContext(SidebarContext);

  const linkTo: string = path;

  const location = useLocation();
  const isCurrentLink = linkTo === location.pathname;
  const history = useHistory();

  /** Toggle nested folders when user
   * is drags an item over a folder after a treshold
   * We open All Sandboxes instantly because that's the root
   * and you can't drop anything in it
   */
  const HOVER_THRESHOLD = name === 'All Sandboxes' ? 0 : 500; // ms
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

interface NestableRowItemProps {
  name: string;
  folderPath: string;
  path: string;
  folders: DashboardBaseFolder[];
}

const NestableRowItem: React.FC<NestableRowItemProps> = ({
  name,
  path,
  folderPath,
  folders,
}) => {
  const { actions, state } = useOvermind();

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
    if (name === 'All Sandboxes') {
      hasNewNestedFolder = true;
    } else if (newFolderParent.length && folderPath.includes(newFolderParent)) {
      hasNewNestedFolder = true;
    }
  }

  const location = useLocation();
  const currentFolderLocationPath = dashboardUrls.allSandboxes(
    folderPath,
    state.activeTeam
  );
  React.useEffect(() => {
    // Auto open folder in the sidebar if it's opened
    const pathName = location.pathname;

    if (
      pathName.startsWith(currentFolderLocationPath + '/') &&
      !foldersVisible
    ) {
      setFoldersVisibility(true);
    }

    // We don't want to recalculate after mount
    // eslint-disable-next-line
  }, [location.pathname, currentFolderLocationPath, setFoldersVisibility]);

  React.useEffect(() => {
    if (hasNewNestedFolder) setFoldersVisibility(true);
  }, [hasNewNestedFolder]);

  const onContextMenu = event => {
    event.preventDefault();
    setMenuVisibility(true);
    setMenuFolder({ name, path: folderPath });
    setMenuPosition({ x: event.clientX, y: event.clientY });
  };

  let subFolders: DashboardBaseFolder[];
  if (name === 'All Sandboxes') {
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

      return parentPath === folderPath;
    });
  }

  const nestingLevel =
    folderPath === '/' ? 0 : folderPath.split('/').length - 1;
  const history = useHistory();

  /* Rename logic */
  const isRenaming = isRenamingFolder && menuFolder.path === folderPath;
  const isNewFolder = newFolderPath === folderPath;
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
        const sanitizedPath = folderPath.replace('__NEW__', newName);
        await actions.dashboard.createFolder(sanitizedPath);
        track('Dashboard - Create Directory', {
          source: 'Sidebar',
          dashboardVersion: 2,
          folderPath: sanitizedPath,
        });
      }
    } else {
      const newPath = join(dirname(folderPath), newName);
      await actions.dashboard.renameFolder({
        path: folderPath,
        newPath,
        teamId: state.activeTeam,
        newTeamId: state.activeTeam,
      });

      track('Dashboard - Rename Folder', {
        source: 'Sidebar',
        dashboardVersion: 2,
      });

      if (currentFolderLocationPath === location.pathname) {
        // if this directory is opened
        history.push(dashboardUrls.allSandboxes(newPath, state.activeTeam));
      }
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

  const folderUrl = dashboardUrls.allSandboxes(folderPath, state.activeTeam);

  return (
    <>
      <RowItem
        name={name}
        path={path}
        folderPath={folderPath}
        icon="folder"
        style={{ height: nestingLevel ? 8 : 10 }}
        setFoldersVisibility={setFoldersVisibility}
      >
        <Link
          to={folderUrl}
          onClick={() => history.push(folderUrl)}
          onContextMenu={onContextMenu}
          onKeyDown={event => {
            if (event.keyCode === ENTER && !isRenaming && !isNewFolder) {
              history.push(folderUrl, {
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
              .sort(a => 1)
              .map(folder => (
                <NestableRowItem
                  key={folder.path}
                  name={folder.name}
                  path={dashboardUrls.allSandboxes(
                    folder.path,
                    state.activeTeam
                  )}
                  folderPath={folder.path}
                  folders={folders}
                />
              ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </>
  );
};
