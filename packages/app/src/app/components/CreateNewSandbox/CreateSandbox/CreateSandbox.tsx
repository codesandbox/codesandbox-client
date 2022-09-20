import { Stack, SkeletonText, ThemeProvider } from '@codesandbox/components';
import { useActions, useAppState } from 'app/overmind';
import React, { ReactNode } from 'react';
import { TabStateReturn, useTabState } from 'reakit/Tab';
import slugify from '@codesandbox/common/lib/utils/slugify';

import { QuickStart } from './QuickStart';
import {
  CloseModal,
  Container,
  MobileTabs,
  Tab,
  TabContent,
  Tabs,
  DashboardButton,
} from './elements';
import { Explore } from './Explore';
import { BackIcon } from './Icons';
import { Import } from './Import';
import { Essentials } from './Essentials';
import { TeamTemplates } from './TeamTemplates';
import { CodeSandboxTemplates } from './CodeSandboxTemplates';
import { useEssentialTemplates } from './useEssentialTemplates';

export const COLUMN_MEDIA_THRESHOLD = 1600;

interface PanelProps {
  tab: TabStateReturn;
  id: string;
  children: ReactNode;
}

/**
 * The Panel component handles the conditional rendering of the actual panel content. This is
 * done with render props as per the Reakit docs.
 */
const Panel = ({ tab, id, children }: PanelProps) => {
  return (
    <TabContent {...tab} stopId={id}>
      {({ hidden, ...rest }) =>
        hidden ? null : <div {...rest}>{children}</div>
      }
    </TabContent>
  );
};

interface CreateSandboxProps {
  collectionId?: string;
  initialTab?: 'import';
  isModal?: boolean;
}

export const CreateSandbox: React.FC<CreateSandboxProps> = ({
  collectionId,
  initialTab,
  isModal,
}) => {
  const { hasLogIn, activeTeamInfo, user } = useAppState();
  const actions = useActions();
  const essentialState = useEssentialTemplates();

  const isSyncedSandboxesPage = location.pathname.includes('/synced-sandboxes');
  const isDashboardPage = location.pathname.includes('/dashboard');
  const isUser = user?.username === activeTeamInfo?.name;

  const tab = useTabState({
    orientation: 'vertical',
    selectedId: initialTab || isSyncedSandboxesPage ? 'import' : 'create',
  });

  const dashboardButtonAttrs = isDashboardPage
    ? {
        onClick: actions.modals.newSandboxModal.close,
      }
    : {
        to: '/dashboard/recent',
        onClick: actions.modals.newSandboxModal.close,
      };

  return (
    <ThemeProvider>
      <Container>
        <Stack direction="vertical">
          {hasLogIn ? (
            <DashboardButton {...dashboardButtonAttrs}>
              <Stack align="center" justify="center">
                <BackIcon />
              </Stack>
              Back to Dashboard
            </DashboardButton>
          ) : (
            <DashboardButton onClick={() => actions.signInClicked()}>
              <Stack align="center" justify="center">
                <BackIcon />
              </Stack>
              Sign in
            </DashboardButton>
          )}
          <Tabs {...tab} aria-label="Create new">
            <Tab {...tab} stopId="quickstart">
              Quickstart
            </Tab>

            <Tab {...tab} stopId="import">
              Import from GitHub
            </Tab>

            {hasLogIn ? (
              <Tab {...tab} stopId="team-templates">
                {`${isUser ? 'My' : 'Team'} templates`}
              </Tab>
            ) : null}

            <Tab {...tab} stopId="csb-templates">
              CodeSandbox templates
            </Tab>

            {essentialState.state === 'success'
              ? essentialState.essentials.map(essential => (
                  <Tab
                    key={essential.key}
                    {...tab}
                    stopId={slugify(essential.title)}
                  >
                    {essential.title}
                  </Tab>
                ))
              : null}

            {essentialState.state === 'loading' ? (
              <div>
                <div>todo skeletons</div>
                <SkeletonText css={{ width: 100 }} />
              </div>
            ) : null}

            {essentialState.state === 'error' ? (
              <div>{essentialState.error}</div>
            ) : null}
          </Tabs>
        </Stack>

        <Panel tab={tab} id="quickstart">
          {/**
           * ❗️ TODO: Update MobileTabs (because they aren't anymore) and move close button
           * higher up in the tree.
           */}
          <MobileTabs>
            {/* ❗️ TODO: Figure out when it isn't a modal */}
            {isModal ? (
              <CloseModal
                type="button"
                onClick={() => actions.modals.newSandboxModal.close()}
              >
                <svg width={10} height={10} fill="none" viewBox="0 0 10 10">
                  <path
                    fill="#fff"
                    d="M10 .91L9.09 0 5 4.09.91 0 0 .91 4.09 5 0 9.09l.91.91L5 5.91 9.09 10l.91-.91L5.91 5 10 .91z"
                  />
                </svg>
              </CloseModal>
            ) : null}
          </MobileTabs>

          <QuickStart collectionId={collectionId} />
        </Panel>

        <Panel tab={tab} id="import">
          <MobileTabs>
            {/* ❗️ TODO: Figure out when it isn't a modal */}
            {isModal ? (
              <CloseModal
                type="button"
                onClick={() => actions.modals.newSandboxModal.close()}
              >
                <svg width={10} height={10} fill="none" viewBox="0 0 10 10">
                  <path
                    fill="#fff"
                    d="M10 .91L9.09 0 5 4.09.91 0 0 .91 4.09 5 0 9.09l.91.91L5 5.91 9.09 10l.91-.91L5.91 5 10 .91z"
                  />
                </svg>
              </CloseModal>
            ) : null}
          </MobileTabs>

          <Import />
        </Panel>

        <Panel tab={tab} id="explore">
          <Explore collectionId={collectionId} />
        </Panel>

        {hasLogIn ? (
          <Panel tab={tab} id="team-templates">
            <TeamTemplates isUser={isUser} teamId={activeTeamInfo?.id} />
          </Panel>
        ) : null}

        <Panel tab={tab} id="csb-templates">
          <CodeSandboxTemplates />
        </Panel>

        {essentialState.state === 'success'
          ? essentialState.essentials.map(essential => (
              <Panel
                key={essential.key}
                tab={tab}
                id={slugify(essential.title)}
              >
                {essential.title}
                <Essentials
                  title={essential.title}
                  templates={essential.templates}
                />
              </Panel>
            ))
          : null}
      </Container>
    </ThemeProvider>
  );
};
