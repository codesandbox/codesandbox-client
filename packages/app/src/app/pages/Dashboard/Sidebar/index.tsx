import React from 'react';
import { useAppState, useActions } from 'app/overmind';
import { motion, AnimatePresence } from 'framer-motion';
import { dashboard as dashboardUrls } from '@codesandbox/common/lib/utils/url-generator';
import { Element, List, Text, Stack } from '@codesandbox/components';
import css from '@styled-system/css';
import { useWorkspaceAuthorization } from 'app/hooks/useWorkspaceAuthorization';
import { useWorkspaceSubscription } from 'app/hooks/useWorkspaceSubscription';
import { useWorkspaceFeatureFlags } from 'app/hooks/useWorkspaceFeatureFlags';
import { ContextMenu } from './ContextMenu';
import { DashboardBaseFolder } from '../types';
import { Position } from '../Components/Selection';
import { SIDEBAR_WIDTH } from './constants';
import { SidebarContext } from './utils';
import { RowItem } from './RowItem';
import { NestableRowItem } from './NestableRowItem';
import { ExpandableReposRowItem } from './ExpandableReposRowItem';
import { UsageProgress } from './UsageProgress';

interface SidebarProps {
  visible: boolean;
  hasTopBarBanner?: boolean;
  onSidebarToggle: () => void;
}

export const ROOT_COLLECTION_NAME = 'All folders';

export const Sidebar: React.FC<SidebarProps> = ({
  visible,
  hasTopBarBanner,
  onSidebarToggle,
}) => {
  const state = useAppState();
  const actions = useActions();

  const { dashboard, activeTeam } = state;

  React.useEffect(() => {
    // Used to fetch collections
    actions.dashboard.getAllFolders();
  }, [state.activeTeam]);

  React.useEffect(() => {
    if (state.hasLoadedApp && state.activeTeam) {
      // Used to check for templates and synced sandboxes
      actions.sidebar.getSidebarData(state.activeTeam);
    }
  }, [state.activeTeam, state.hasLoadedApp, actions.sidebar]);

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

  const showRespositories = !state.environment.isOnPrem;

  const { ubbBeta } = useWorkspaceFeatureFlags();
  const { isPrimarySpace, isTeamAdmin } = useWorkspaceAuthorization();
  const { isPro } = useWorkspaceSubscription();

  const showTemplates = state.activeTeam
    ? state.sidebar[state.activeTeam]?.hasTemplates
    : false;
  const showSyncedSandboxes = state.activeTeam
    ? state.sidebar[state.activeTeam]?.hasSyncedSandboxes
    : false;

  const getMaxCredits = () => {
    let maxCredits = state.activeTeamInfo.limits?.includedCredits;
    if (isPro) {
      maxCredits += state.activeTeamInfo.limits?.onDemandCreditLimit;
    }

    return maxCredits;
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
        gap={6}
        css={css({
          width: SIDEBAR_WIDTH,
          zIndex: 3,
          marginTop: '12px',
          paddingBottom: '32px',
          // We set sidebar as absolute so that content can
          // take 100% width, this helps us enable dragging
          // sandboxes onto the sidebar more freely.
          position: 'absolute',
          // 100vh - topbar height - (banner height or 0) - margin top
          height: `calc(100vh - 60px - ${
            hasTopBarBanner ? '44' : '0'
          }px - 12px)`,
        })}
      >
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
            name="Settings"
            page="external"
            path={dashboardUrls.portalOverview(activeTeam)}
            icon="gear"
          />
          <RowItem
            name="Invite members"
            page="external"
            path={dashboardUrls.portalOverview(activeTeam)}
            icon="people"
          />
          <RowItem
            name="Get started"
            page="get-started"
            path={dashboardUrls.getStarted(activeTeam)}
            icon="documentation"
          />
          {isTeamAdmin && (
            <RowItem
              name="Upgrade"
              page="external"
              path={dashboardUrls.upgradeUrl({
                workspaceId: activeTeam,
                source: 'sidebar',
              })}
              icon="proBadge"
              style={{ color: '#BDB1F6' }}
            />
          )}

          {showRespositories && (
            <>
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

              <ExpandableReposRowItem />

              {isPrimarySpace && (
                <RowItem
                  name="My contributions"
                  page="my-contributions"
                  path={dashboardUrls.myContributions(activeTeam)}
                  icon="contribution"
                />
              )}
            </>
          )}

          <Element marginTop={4} />
          <Element paddingX={7} paddingY={2}>
            <Text
              variant="muted"
              size={2}
              css={css({ color: 'sideBarSectionHeader.foreground' })}
            >
              Devboxes and Sandboxes
            </Text>
          </Element>
          <RowItem
            name="Drafts"
            page="drafts"
            path={dashboardUrls.drafts(activeTeam)}
            icon="file"
          />

          <NestableRowItem
            name={ROOT_COLLECTION_NAME}
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

          {showTemplates ? (
            <RowItem
              name="Templates"
              page="templates"
              path={dashboardUrls.templates(activeTeam)}
              icon="star"
            />
          ) : null}

          {showSyncedSandboxes ? (
            <RowItem
              name="Imported templates"
              page="synced-sandboxes"
              path={dashboardUrls.syncedSandboxes(activeTeam)}
              icon="sync"
            />
          ) : null}

          <RowItem
            name="Recently deleted"
            page="deleted"
            path={dashboardUrls.deleted(activeTeam)}
            icon="trash"
          />
          <Element marginTop={4} />
          <RowItem
            name="Shared with me"
            page="shared"
            path={dashboardUrls.shared(activeTeam)}
            icon="sharing"
          />
        </List>
        {ubbBeta && state.activeTeamInfo && (
          <UsageProgress
            workspaceId={activeTeam}
            maxCredits={getMaxCredits()}
            usedCredits={state.activeTeamInfo.usage?.credits}
          />
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
