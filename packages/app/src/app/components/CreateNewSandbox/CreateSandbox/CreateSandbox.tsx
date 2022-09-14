import { Stack, ThemeProvider } from '@codesandbox/components';
import { useActions, useAppState } from 'app/overmind';
import React, { ReactNode, useEffect } from 'react';
import { TabStateReturn, useTabState } from 'reakit/Tab';

import { Create } from './Create';
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
        hidden ? null : (
          <div hidden={hidden} {...rest}>
            {children}
          </div>
        )
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
  const { hasLogIn } = useAppState();
  const actions = useActions();

  const tab = useTabState({
    orientation: 'vertical',
    selectedId: initialTab || 'create',
  });

  useEffect(() => {
    /* ❗️ TODO: We can probably take this out of the useEffect and put it into the useTabState selectedId */
    if (location.pathname.includes('/repositories')) {
      tab.select('Import');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const dashboardButtonAttrs = location.pathname.includes('/dashboard')
    ? {
        onClick: actions.modals.newSandboxModal.close,
      }
    : {
        to: '/dashboard',
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
            <Tab {...tab} stopId="create">
              Create Sandbox
            </Tab>
            <Tab {...tab} stopId="import">
              Import Project
            </Tab>
            <Tab {...tab} stopId="my-templates">
              My templates
            </Tab>
            <Tab {...tab} stopId="csb-templates">
              CodeSandbox templates
            </Tab>
            <Tab {...tab} stopId="react-essentials">
              React essentials
            </Tab>
            <Tab {...tab} stopId="vue-essentials">
              Vue essentials
            </Tab>
            <Tab {...tab} stopId="angular-essentials">
              Angular essentials
            </Tab>
            <Tab {...tab} stopId="ui-frameworks">
              UI frameworks
            </Tab>
            <Tab {...tab} stopId="component-libraries">
              Component libraries
            </Tab>
            <Tab {...tab} stopId="starters">
              Web App and API Starters
            </Tab>
            <Tab {...tab} stopId="databases">
              Databases
            </Tab>
          </Tabs>
        </Stack>
        <Panel tab={tab} id="create">
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

          <Create collectionId={collectionId} />
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
        <Panel tab={tab} id="my-templates">
          My templates
        </Panel>
        <Panel tab={tab} id="csb-templates">
          CodeSandbox templates
        </Panel>
        <Panel tab={tab} id="react-essentials">
          React essentials
        </Panel>
        <Panel tab={tab} id="vue-essentials">
          Vue essentials
        </Panel>
        <Panel tab={tab} id="angular-essentials">
          Angular essentials
        </Panel>
        <Panel tab={tab} id="ui-frameworks">
          UI frameworks
        </Panel>
        <Panel tab={tab} id="component-libraries">
          Component libraries
        </Panel>
        <Panel tab={tab} id="starters">
          Web App and API Starters
        </Panel>
        <Panel tab={tab} id="databases">
          Databases
        </Panel>
      </Container>
    </ThemeProvider>
  );
};
