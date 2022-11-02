import React from 'react';
import { Link as RouterLink, useLocation, useHistory } from 'react-router-dom';
import { orderBy } from 'lodash-es';
import { join, dirname } from 'path';
import { useAppState, useActions, useEffects } from 'app/overmind';
import { motion, AnimatePresence } from 'framer-motion';
import { dashboard as dashboardUrls } from '@codesandbox/common/lib/utils/url-generator';
import { ESC, ENTER } from '@codesandbox/common/lib/utils/keycodes';
import track, {
  trackImprovedDashboardEvent,
} from '@codesandbox/common/lib/utils/analytics';
import { SkeletonTextBlock } from 'app/pages/Sandbox/Editor/Skeleton/elements';
import {
  Element,
  List,
  SidebarListAction,
  Link,
  Text,
  Stack,
  Icon,
  IconButton,
  Input,
  IconNames,
} from '@codesandbox/components';
import css from '@styled-system/css';
import merge from 'deepmerge';
import { WorkspaceSelect } from 'app/components/WorkspaceSelect';
import {
  SubscriptionStatus,
  SubscriptionType,
  TeamMemberAuthorization,
} from 'app/graphql/types';
import { getDaysUntil } from 'app/utils/dateTime';
import { ContextMenu } from './ContextMenu';
import { DashboardBaseFolder, PageTypes } from '../types';
import { Position } from '../Components/Selection';
import { SIDEBAR_WIDTH, NEW_FOLDER_ID } from './constants';
import { DragItemType, useDrop } from '../utils/dnd';
import { NotificationIndicator } from '../Components/Notification/NotificationIndicator';
import { AdminUpgradeToTeamPro } from './BottomMessages/AdminUpgradeToTeamPro';
import { UserUpgradeToTeamPro } from './BottomMessages/UserUpgradeToTeamPro';
import { TrialExpiring } from './BottomMessages/TrialExpiring';
import { UpgradeToPersonalPro } from './BottomMessages/UpgradeToPersonalPro';
import { AdminStartTrial } from './BottomMessages/AdminStartTrial';

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
  const history = useHistory();
  const state = useAppState();
  const actions = useActions();

  const {
    dashboard,
    activeTeam,
    activeTeamInfo,
    personalWorkspaceId,
    activeWorkspaceAuthorization,
  } = state;

  React.useEffect(() => {
    // Used to fetch collections
    actions.dashboard.getAllFolders();
    actions.dashboard.getStarredRepos();
  }, [state.activeTeam]);

  React.useEffect(() => {
    // Used to check for templates and synced sandboxes
    actions.sidebar.getSidebarData(
      state.activeTeam !== personalWorkspaceId ? state.activeTeam : undefined
    );
  }, [state.activeTeam, personalWorkspaceId, actions.sidebar]);

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

  const teamDataLoaded = dashboard.teams.length > 0 && activeTeamInfo;

  const subscription = activeTeamInfo?.subscription;
  const isPersonalSpace = activeTeam === personalWorkspaceId;
  const isTeamSpace = !isPersonalSpace;
  const isTeamAdmin =
    isTeamSpace &&
    activeWorkspaceAuthorization === TeamMemberAuthorization.Admin;

  // There are different statuses for a subscription,
  // but only ACTIVE and TRIALING should be considered an active TeamPro subscription
  // TODO: This might change based on how we use other statuses in the subscription (eg: PAUSED)
  const hasActiveSubscription =
    subscription?.status === SubscriptionStatus.Active ||
    subscription?.status === SubscriptionStatus.Trialing;

  // Trial is only available for TeamPro
  const hasActiveTeamProTrial =
    isTeamSpace &&
    subscription?.type === SubscriptionType.TeamPro &&
    subscription?.status === SubscriptionStatus.Trialing;

  // Only team admin can start a trial, if there was not subscription on this team before
  const eligibleToStartTrial = isTeamAdmin && !subscription;

  // If no active subscription, flag as personal/team free to show CTA to upgrade
  const isTeamFree = isTeamSpace && !hasActiveSubscription;
  const isPersonalFree = isPersonalSpace && !hasActiveSubscription;

  // Only team admin can upgrade to TeamPro, team users will get a static non-CTA message
  const isTeamFreeAdmin = isTeamFree && isTeamAdmin;
  const isTeamFreeUser = isTeamFree && !isTeamAdmin;

  // Compute number of days left for TeamPro trial
  const trialDaysLeft = hasActiveTeamProTrial
    ? getDaysUntil(subscription?.trialEnd)
    : null;

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
        gap={6}
        {...props}
        css={css({
          width: SIDEBAR_WIDTH,
          zIndex: 3,
          paddingTop: '23px',
          ...props.css,
        })}
      >
        <Stack direction="horizontal">
          {teamDataLoaded ? (
            <WorkspaceSelect
              selectedTeamId={activeTeam}
              onSelect={teamId => {
                actions.setActiveTeam({
                  id: teamId,
                });

                history.replace(dashboardUrls.recent(teamId));
              }}
            />
          ) : (
            <Stack align="center" css={{ width: '100%', paddingLeft: '28px' }}>
              <SkeletonTextBlock
                css={{ width: 120, height: 12, marginLeft: 8 }}
              />
            </Stack>
          )}
          <Link
            css={{
              height: '36px',
              width: '36px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#C2C2C2',
              transition: 'all 0.1s ease-in',
              borderRadius: '0 2px 2px 0',
              '&:hover': {
                background: '#242424',
                color: '#fff',
              },
            }}
            as={RouterLink}
            to={dashboardUrls.settings(state.activeTeam)}
            title="Settings"
          >
            <Icon name="gear" size={16} />
          </Link>
        </Stack>

        <List
          css={{
            display: 'flex',
            flexDirection: 'column',
            flex: 1,
            height: '100%',
            overflowY: 'auto',
            overflowX: 'hidden',
          }}
        >
          <RowItem
            name="Recent"
            page="recent"
            path={dashboardUrls.recent(activeTeam)}
            icon="clock"
          />
          <RowItem
            name="Discover"
            page="discover"
            path={dashboardUrls.discover(activeTeam)}
            icon="discover"
          />
          {isPersonalSpace && (
            <RowItem
              name="Shared With Me"
              page="shared"
              path={dashboardUrls.shared(activeTeam)}
              icon="sharing"
            />
          )}
          {isPersonalSpace && (
            <RowItem
              name="Likes"
              page="liked"
              path={dashboardUrls.liked(activeTeam)}
              icon="heart"
            />
          )}
          <Element marginTop={4} />
          <Element paddingX={7} paddingY={2}>
            <Text
              variant="muted"
              size={2}
              css={css({ color: 'sideBarSectionHeader.foreground' })}
            >
              Repositories
            </Text>
          </Element>
          {isPersonalSpace && (
            <RowItem
              name="My contributions"
              page="my-contributions"
              path={dashboardUrls.myContributions(activeTeam)}
              icon="contribution"
            />
          )}
          <RowItem
            name="All repositories"
            page="repositories"
            path={dashboardUrls.repositories(activeTeam)}
            icon="repository"
          />
          {dashboard.starredRepos.map(repo => (
            <RowItem
              name={repo.name}
              page="repositories"
              path={dashboardUrls.repository(repo)}
              icon="star"
              nestingLevel={1}
              style={{
                whiteSpace: 'nowrap',
              }}
            />
          ))}
          <Element marginTop={4} />
          <Element paddingX={7} paddingY={2}>
            <Text
              variant="muted"
              size={2}
              css={css({ color: 'sideBarSectionHeader.foreground' })}
            >
              Sandboxes
            </Text>
          </Element>
          <RowItem
            name="My drafts"
            page="drafts"
            path={dashboardUrls.drafts(activeTeam)}
            icon="file"
          />

          {state.sidebar.hasTemplates ? (
            <RowItem
              name="Templates"
              page="templates"
              path={dashboardUrls.templates(activeTeam)}
              icon="star"
            />
          ) : null}

          <NestableRowItem
            name="All sandboxes"
            path={dashboardUrls.sandboxes('/', activeTeam)}
            page="sandboxes"
            folderPath="/"
            folders={[
              ...folders,
              ...(newFolderPath
                ? [{ path: newFolderPath, name: '', parent: null }]
                : []),
            ]}
          />

          {state.sidebar.hasSyncedSandboxes ? (
            <RowItem
              name="Synced"
              page="synced-sandboxes"
              path={dashboardUrls.syncedSandboxes(activeTeam)}
              icon="sync"
            />
          ) : null}

          <RowItem
            name="Archive"
            page="archive"
            path={dashboardUrls.archive(activeTeam)}
            icon="archive"
          />
          <Element marginTop={3} />
        </List>

        {teamDataLoaded && (
          <Element css={{ padding: '24px', paddingTop: 0 }}>
            {isTeamFreeAdmin && eligibleToStartTrial && <AdminStartTrial />}
            {isTeamFreeAdmin && !eligibleToStartTrial && (
              <AdminUpgradeToTeamPro />
            )}
            {isTeamFreeUser && <UserUpgradeToTeamPro />}
            {isPersonalFree && <UpgradeToPersonalPro />}
            {hasActiveTeamProTrial &&
              trialDaysLeft !== null &&
              trialDaysLeft <= 5 && (
                <TrialExpiring daysLeft={trialDaysLeft} isAdmin={isTeamAdmin} />
              )}
          </Element>
        )}
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

const canNotAcceptSandboxes: PageTypes[] = ['recent'];
const canNotAcceptFolders: PageTypes[] = ['recent', 'drafts', 'templates'];

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

const MAP_SIDEBAR_ITEM_EVENT_TO_PAGE_TYPE: Partial<Record<
  PageTypes,
  string
>> = {
  recent: 'Dashboard - View Recent',
  'my-contributions': 'Dashboard - View My Contributions',
  repositories: 'Dashboard - View Repositories',
  drafts: 'Dashboard - View Drafts',
  templates: 'Dashboard - View Templates',
  sandboxes: 'Dashboard - View Sandboxes',
  'synced-sandboxes': 'Dashboard - View Synced Sandboxes',
  archive: 'Dashboard - View Archive',
  discover: 'Dashboard - View Discover',
  shared: 'Dashboard - View Shared',
  liked: 'Dashboard - View Liked',
};

interface RowItemProps {
  name: string;
  path: string;
  icon: IconNames;
  page: PageTypes;
  setFoldersVisibility?: (val: boolean) => void;
  folderPath?: string;
  style?: React.CSSProperties;
  nestingLevel?: number;
}
const RowItem: React.FC<RowItemProps> = ({
  name,
  path,
  folderPath = path,
  nestingLevel = 0,
  page,
  icon,
  setFoldersVisibility = null,
  ...props
}) => {
  const accepts: Array<'sandbox' | 'folder' | 'template'> = [];
  if (!canNotAcceptSandboxes.includes(page)) {
    accepts.push('template');
    accepts.push('sandbox');
  }
  if (!canNotAcceptFolders.includes(page)) accepts.push('folder');
  const { browser } = useEffects();

  const isPageWithNotification =
    page === 'my-contributions' ||
    page === 'repositories' ||
    page === 'synced-sandboxes';

  const isNotificationDismissed = browser.storage.get(
    'notificationDismissed'
  )?.[page];

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
  const HOVER_THRESHOLD = folderPath === '/' ? 0 : 500; // ms
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
    <SidebarListAction
      ref={dropRef}
      align="center"
      onClick={onSidebarToggle}
      css={css(
        merge(
          {
            minHeight: nestingLevel ? 8 : 9,
            paddingX: 0,
            opacity: isDragging && !canDrop ? 0.25 : 1,
            color:
              isCurrentLink || (isDragging && canDrop)
                ? 'sideBar.foreground'
                : 'sideBarTitle.foreground',
            backgroundColor:
              canDrop && isOver ? 'list.hoverBackground' : 'transparent',
            transition: 'all ease-in',
            transitionDuration: theme => theme.speeds[1],
            a: {
              ':focus': {
                // focus state is handled by SidebarListAction:focus-within
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
            ...(page === 'external'
              ? { href: linkTo, target: '_blank' }
              : { to: linkTo }),
            as: page === 'external' ? 'a' : RouterLink,
            style: linkStyles,
            onKeyDown: event => {
              if (event.keyCode === ENTER) {
                history.push(linkTo, { focus: 'FIRST_ITEM' });
              }
            },
            onClick: () => {
              const event = MAP_SIDEBAR_ITEM_EVENT_TO_PAGE_TYPE[page];
              if (event) {
                trackImprovedDashboardEvent(
                  MAP_SIDEBAR_ITEM_EVENT_TO_PAGE_TYPE[page]
                );
              }

              return false;
            },
          }}
        >
          <Stack
            as="span"
            css={{ width: '40px' }}
            align="center"
            justify="center"
          >
            <Icon name={icon} />
          </Stack>
          {name}

          {isPageWithNotification && !isNotificationDismissed ? (
            <Element
              css={{
                flexGrow: 1,
                display: 'flex',
                justifyContent: 'flex-end',
              }}
            >
              <NotificationIndicator />
            </Element>
          ) : null}
        </Link>
      )}
    </SidebarListAction>
  );
};

interface NestableRowItemProps {
  name: string;
  folderPath: string;
  path: string;
  page: PageTypes;
  folders: DashboardBaseFolder[];
}

const NestableRowItem: React.FC<NestableRowItemProps> = ({
  name,
  path,
  page,
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
    if (folderPath === '/') {
      hasNewNestedFolder = true;
    } else if (newFolderParent.length && folderPath.includes(newFolderParent)) {
      hasNewNestedFolder = true;
    }
  }

  const location = useLocation();
  const currentFolderLocationPath = dashboardUrls.sandboxes(folderPath);
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
  if (folderPath === '/') {
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
        history.push(dashboardUrls.sandboxes(newPath, state.activeTeam));
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

  const folderUrl = dashboardUrls.sandboxes(folderPath, state.activeTeam);

  return (
    <>
      <RowItem
        name={name}
        path={path}
        folderPath={folderPath}
        page="sandboxes"
        icon="folder"
        nestingLevel={nestingLevel}
        setFoldersVisibility={setFoldersVisibility}
      >
        <Link
          to={folderUrl}
          title={name}
          onClick={() => {
            const event = MAP_SIDEBAR_ITEM_EVENT_TO_PAGE_TYPE[page];
            if (event) {
              trackImprovedDashboardEvent(
                MAP_SIDEBAR_ITEM_EVENT_TO_PAGE_TYPE[page]
              );
            }
            history.push(folderUrl);
            return false;
          }}
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
                  transitionDuration: theme => theme.speeds[1],
                },
              })}
            />
          ) : (
            <Element as="span" css={css({ width: 4, flexShrink: 0 })} />
          )}

          <Stack
            align="center"
            gap={2}
            css={{
              paddingLeft: 0,
              paddingRight: 0,
              marginRight: '0',
              width: '96%',
            }}
          >
            <Stack
              justify="center"
              align="center"
              css={{
                padding: '0 4px',
                marginRight: '8px',
              }}
            >
              <Icon name="folder" size={16} />
            </Stack>

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
                  page={page}
                  key={folder.path}
                  name={folder.name}
                  path={dashboardUrls.sandboxes(folder.path, state.activeTeam)}
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
