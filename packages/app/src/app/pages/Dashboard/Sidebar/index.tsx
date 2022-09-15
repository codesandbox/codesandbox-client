import React, { useState } from 'react';
import { Link as RouterLink, useLocation, useHistory } from 'react-router-dom';
import { orderBy } from 'lodash-es';
import { join, dirname } from 'path';
import { useAppState, useActions } from 'app/overmind';
import { motion, AnimatePresence } from 'framer-motion';
import { dashboard as dashboardUrls } from '@codesandbox/common/lib/utils/url-generator';
import { ESC, ENTER } from '@codesandbox/common/lib/utils/keycodes';
import track from '@codesandbox/common/lib/utils/analytics';
import { SkeletonTextBlock } from 'app/pages/Sandbox/Editor/Skeleton/elements';
import {
  Element,
  List,
  ListAction,
  ListItem,
  Link,
  Text,
  Stack,
  Icon,
  IconButton,
  Button,
  Input,
  IconNames,
} from '@codesandbox/components';
import styled from 'styled-components';
import css from '@styled-system/css';
import merge from 'deepmerge';
import { WorkspaceSelect } from 'app/components/WorkspaceSelect';
import { ContextMenu } from './ContextMenu';
import { DashboardBaseFolder, PageTypes } from '../types';
import { Position } from '../Components/Selection';
import { SIDEBAR_WIDTH, NEW_FOLDER_ID } from './constants';
import { DragItemType, useDrop } from '../utils/dnd';

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
  const state = useAppState();
  const actions = useActions();
  const [activeAccount, setActiveAccount] = useState<{
    id: string;
    name: string;
    avatarUrl: string;
  } | null>(null);
  const { dashboard, activeTeam, activeTeamInfo, user } = state;

  React.useEffect(() => {
    actions.dashboard.getAllFolders();
  }, [actions.dashboard, state.activeTeam]);

  React.useEffect(() => {
    if (state.activeTeam) {
      const team = dashboard.teams.find(({ id }) => id === state.activeTeam);
      if (team) {
        const isPersonalWorkspace = team.id === state.personalWorkspaceId;
        setActiveAccount({
          id: team.id,
          name: team.name,
          avatarUrl:
            isPersonalWorkspace && user ? user.avatarUrl : team.avatarUrl,
        });
      }
    }
  }, [state.activeTeam, state.activeTeamInfo, dashboard.teams]);

  const folders =
    (dashboard.allCollections || []).filter(folder => folder.path !== '/') ||
    [];

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
          borderColor: 'transparent',
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
          <ListItem
            css={css({
              paddingLeft: '6px',
              paddingRight: 0,
              height: 10,
              backgroundColor: 'sideBar.hoverBackground',
            })}
          >
            {activeAccount ? (
              <WorkspaceSelect
                onSelect={workspace => {
                  actions.setActiveTeam({
                    id: workspace.id,
                  });
                }}
                activeAccount={activeAccount}
              />
            ) : (
              <Stack align="center" css={{ width: '100%' }}>
                <SkeletonTextBlock
                  css={{ width: 26, height: 26, marginLeft: 8 }}
                />
                <SkeletonTextBlock
                  css={{ width: 65, height: 12, marginLeft: 8 }}
                />
              </Stack>
            )}
            <Link
              css={css({ height: '100%' })}
              as={RouterLink}
              to={dashboardUrls.settings(state.activeTeam)}
            >
              <IconButton
                name="gear"
                size={8}
                title="Settings"
                css={css({
                  width: 8,
                  height: '100%',
                  borderRadius: 0,
                })}
              />
            </Link>
          </ListItem>
          <RowItem
            name="Home"
            page="home"
            path={dashboardUrls.home(activeTeam)}
            icon="box"
            style={{ marginTop: 1 }}
          />
          <RowItem
            name="Discover"
            page="discover"
            path={dashboardUrls.discover(activeTeam)}
            icon="discover"
          />

          <RowItem
            name="My Drafts"
            page="drafts"
            path={dashboardUrls.drafts(activeTeam)}
            icon="file"
          />
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
          <RowItem
            name="Templates"
            page="templates"
            path={dashboardUrls.templates(activeTeam)}
            icon="star"
          />
          {activeTeamInfo?.joinedPilotAt && (
            <RowItem
              name="Always-On"
              page="always-on"
              path={dashboardUrls.alwaysOn(activeTeam)}
              icon="server"
            />
          )}
          <RowItem
            name="Recently Modified"
            page="recents"
            path={dashboardUrls.recents(activeTeam)}
            icon="clock"
          />
          <RowItem
            name="Recently Deleted"
            page="deleted"
            path={dashboardUrls.deleted(activeTeam)}
            icon="trash"
          />
          <Element marginTop={8} />
          <RowItem
            name="Shared With Me"
            page="shared"
            path={dashboardUrls.shared(activeTeam)}
            icon="sharing"
          />
          <RowItem
            name="Likes by Me"
            page="liked"
            path={dashboardUrls.liked(activeTeam)}
            icon="heart"
          />
          <Element marginTop={8} />
          <RowItem
            name="Open source"
            page="open-source-repos"
            path={dashboardUrls.openSourceRepos(activeTeam)}
            icon="link" // Temp icon.
          />

          <RowItem
            name="All repositories"
            page="v2-repos"
            path={dashboardUrls.v2Repos(activeTeam)}
            icon="projects" // Temp icon.
          />

          <RowItem
            name="Legacy repositories"
            page="legacy-repos"
            path={dashboardUrls.legacyRepos(activeTeam)}
            icon="fork" // Temp icon.
          />

          <Menu.Divider />

          <RowItem
            name="Go to Projects"
            page="external"
            path="/p/dashboard?from=sidebar"
            icon="projects"
            badge
          />
        </List>

        <Element margin={4}>
          <Button onClick={actions.openCreateTeamModal} variant="secondary">
            <Icon name="plus" size={10} marginRight={1} />
            Create a new team
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
        authorization={state.activeWorkspaceAuthorization}
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

const Badge = styled.p`
  border-radius: 2px;
  background-color: ${({ theme }) => theme.colors.blues[700]};
  color: ${({ theme }) => theme.colors.white};

  width: ${({ theme }) => theme.sizes[7]}px;
  height: ${({ theme }) => theme.sizes[3]}px;

  text-align: center;
  line-height: 1.3;
  font-size: ${({ theme }) => theme.fontSizes[1]}px;
  font-weight: ${({ theme }) => theme.fontWeights.medium};

  position: relative;
  top: 1px; // 👌
`;

const canNotAcceptSandboxes: PageTypes[] = ['home', 'recents', 'always-on'];
const canNotAcceptFolders: PageTypes[] = [
  'home',
  'recents',
  'drafts',
  'templates',
  'always-on',
];

const isSamePath = (
  draggedItem: DragItemType,
  currentPage: PageTypes,
  dropPath: string
) => {
  if (!draggedItem) return false;

  if (
    draggedItem.type === 'sandbox' &&
    draggedItem.sandbox.collection?.path === dropPath
  ) {
    return true;
  }

  if (draggedItem.type === 'template' && currentPage === 'templates') {
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
  page: PageTypes;
  setFoldersVisibility?: (val: boolean) => void;
  folderPath?: string;
  style?: React.CSSProperties;
  badge?: boolean;
}

const RowItem: React.FC<RowItemProps> = ({
  name,
  path,
  folderPath = path,
  page,
  icon,
  setFoldersVisibility = null,
  badge,
  ...props
}) => {
  const accepts: Array<'sandbox' | 'folder' | 'template'> = [];
  if (!canNotAcceptSandboxes.includes(page)) {
    accepts.push('template');
    accepts.push('sandbox');
  }
  if (!canNotAcceptFolders.includes(page)) accepts.push('folder');

  const usedPath = folderPath || path;
  const [{ canDrop, isOver, isDragging }, dropRef] = useDrop({
    accept: accepts,
    drop: item => ({
      page,
      path: usedPath,
      isSamePath: isSamePath(item, page, usedPath),
    }),
    collect: monitor => ({
      isOver: monitor.isOver(),
      canDrop:
        monitor.canDrop() && !isSamePath(monitor.getItem(), page, usedPath),
      isDragging: !!monitor.getItem(),
    }),
  });

  const { onSidebarToggle } = React.useContext(SidebarContext);

  const linkTo: string = path;

  const location = useLocation();
  const isCurrentLink = linkTo.replace(/\?.*/, '') === location.pathname;
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
          {...{
            ...(page === 'external' ? { href: linkTo } : { to: linkTo }),
            as: page === 'external' ? 'a' : RouterLink,
            style: linkStyles,
            onKeyDown: event => {
              if (event.keyCode === ENTER) {
                history.push(linkTo, { focus: 'FIRST_ITEM' });
              }
            },
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
          {badge && (
            <Stack
              as="span"
              css={css({ width: 10 })}
              align="center"
              justify="center"
            >
              <Badge>New</Badge>
            </Stack>
          )}
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
  const actions = useActions();
  const state = useAppState();

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
    const newFolderParent = newFolderPath.replace(`/${NEW_FOLDER_ID}`, '');
    if (name === 'All Sandboxes') {
      hasNewNestedFolder = true;
    } else if (newFolderParent.length && folderPath.includes(newFolderParent)) {
      hasNewNestedFolder = true;
    }
  }

  const location = useLocation();
  const currentFolderLocationPath = dashboardUrls.allSandboxes(folderPath);
  React.useEffect(() => {
    // Auto open folder in the sidebar if it's opened
    const pathName = location.pathname;
    const prefixCheck =
      folderPath === '/'
        ? currentFolderLocationPath
        : currentFolderLocationPath + '/';

    if (pathName.startsWith(prefixCheck) && !foldersVisible) {
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
        return newFolderPath.replace(`/${NEW_FOLDER_ID}`, '') === '';
      }
      return !folder.parent;
    });
  } else {
    subFolders = folders.filter(folder => {
      const parentPath = folder.path.split('/').slice(0, -1).join('/');

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
    const { value } = event.target;
    if (value && value.trim()) {
      event.target.setCustomValidity('');
    } else {
      event.target.setCustomValidity('Folder name is required.');
    }
    setNewName(value);
  };
  const onInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.keyCode === ESC) {
      // Reset value and exit without saving
      setNewName(name);
      setRenamingFolder(false);
      setNewFolderPath(null);
    }
  };
  const onInputClick = (event: React.MouseEvent<HTMLInputElement>) => {
    // prevent redirection when Input is clicked.
    event.stopPropagation();
  };

  const onSubmit = async (event?: React.FormEvent<HTMLFormElement>) => {
    if (event) event.preventDefault();

    if (name === newName) {
      // nothing to do here
    } else if (isNewFolder) {
      if (newName) {
        const sanitizedPath = folderPath.replace(NEW_FOLDER_ID, newName);
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
        page="sandboxes"
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
                width: 4,
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
            <Element as="span" css={css({ width: 4, flexShrink: 0 })} />
          )}

          <Stack align="center" gap={2} css={{ width: 'calc(100% - 28px)' }}>
            <Icon name="folder" size={24} css={css({ flexShrink: 0 })} />

            {isRenaming || isNewFolder ? (
              <form onSubmit={onSubmit}>
                <Input
                  autoFocus
                  required
                  onClick={onInputClick}
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
