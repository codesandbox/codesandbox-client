import React from 'react';
import { Link as RouterLink, useHistory } from 'react-router-dom';
import { useAppState, useActions } from 'app/overmind';
import { motion, AnimatePresence } from 'framer-motion';
import { dashboard as dashboardUrls } from '@codesandbox/common/lib/utils/url-generator';
import { SkeletonTextBlock } from 'app/pages/Sandbox/Editor/Skeleton/elements';
import {
  Element,
  List,
  Link,
  Text,
  Stack,
  Icon,
} from '@codesandbox/components';
import css from '@styled-system/css';
import { WorkspaceSelect } from 'app/components/WorkspaceSelect';
import { getDaysUntil } from 'app/utils/dateTime';
import { useWorkspaceAuthorization } from 'app/hooks/useWorkspaceAuthorization';
import { useSubscription } from 'app/hooks/useSubscription';
import { ContextMenu } from './ContextMenu';
import { DashboardBaseFolder } from '../types';
import { Position } from '../Components/Selection';
import { SIDEBAR_WIDTH } from './constants';
import { AdminUpgradeToTeamPro } from './BottomMessages/AdminUpgradeToTeamPro';
import { UserUpgradeToTeamPro } from './BottomMessages/UserUpgradeToTeamPro';
import { TrialExpiring } from './BottomMessages/TrialExpiring';
import { UpgradeToPersonalPro } from './BottomMessages/UpgradeToPersonalPro';
import { AdminStartTrial } from './BottomMessages/AdminStartTrial';
import { SidebarContext } from './utils';
import { RowItem } from './RowItem';
import { NestableRowItem } from './NestableRowItem';

const END_OF_TRIAL_DAYS_NOTIFICATION = 5;

interface SidebarProps {
  visible: boolean;
  onSidebarToggle: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  visible,
  onSidebarToggle,
}) => {
  const history = useHistory();
  const state = useAppState();
  const actions = useActions();

  const { dashboard, activeTeam, activeTeamInfo, personalWorkspaceId } = state;

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

  const {
    isPersonalSpace,
    isTeamSpace,
    isTeamAdmin,
  } = useWorkspaceAuthorization();

  const {
    subscription,
    hasActiveSubscription,
    hasActiveTeamTrial,
    isEligibleForTrial,
  } = useSubscription();

  // Compute number of days left for TeamPro trial
  const trialDaysLeft = hasActiveTeamTrial
    ? getDaysUntil(subscription?.trialEnd)
    : null;

  const showBottomMessage =
    !hasActiveSubscription ||
    (trialDaysLeft !== null && trialDaysLeft <= END_OF_TRIAL_DAYS_NOTIFICATION);

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
          paddingTop: '23px',
          // We set sidebar as absolute so that content can
          // take 100% width, this helps us enable dragging
          // sandboxes onto the sidebar more freely.
          position: 'absolute',
          height: 'calc(100% - 48px)',
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

        {teamDataLoaded && showBottomMessage && (
          <Element css={{ margin: '24px', paddingTop: 0 }}>
            {isTeamAdmin &&
              (isEligibleForTrial ? (
                <AdminStartTrial activeTeam={activeTeam} />
              ) : (
                <AdminUpgradeToTeamPro />
              ))}

            {isTeamSpace && !hasActiveSubscription && !isTeamAdmin ? (
              <UserUpgradeToTeamPro />
            ) : null}

            {isPersonalSpace && !hasActiveSubscription ? (
              <UpgradeToPersonalPro />
            ) : null}

            {hasActiveTeamTrial &&
              trialDaysLeft !== null &&
              trialDaysLeft <= END_OF_TRIAL_DAYS_NOTIFICATION && (
                <TrialExpiring
                  activeTeam={activeTeam}
                  daysLeft={trialDaysLeft}
                  isAdmin={isTeamAdmin}
                />
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
