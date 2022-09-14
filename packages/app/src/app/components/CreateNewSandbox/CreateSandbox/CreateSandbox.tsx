import { Stack, ThemeProvider } from '@codesandbox/components';
import css from '@styled-system/css';
import { useActions, useAppState } from 'app/overmind';
import React, { useEffect } from 'react';
import { useTabState } from 'reakit/Tab';

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
import {
  PlusIcon,
  StarIcon,
  UploadIcon,
  BackIcon,
} from './Icons';
import { Import } from './Import';

export const COLUMN_MEDIA_THRESHOLD = 1600;

interface CreateSandboxProps {
  collectionId?: string;
  initialTab?: 'Import';
  isModal?: boolean;
}

export const CreateSandbox: React.FC<CreateSandboxProps> = props => {
  const { hasLogIn } = useAppState();
  const actions = useActions();

  const tab = useTabState({
    orientation: 'vertical',
    selectedId: props.initialTab || 'Create',
  });

  useEffect(() => {
    if (location.pathname.includes('/repositories')) {
      tab.select('Import');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const dashboardButtonAttrs = () => {
    if (location.pathname.includes('/dashboard')) {
      return {
        onClick: actions.modals.newSandboxModal.close,
      };
    }
    return {
      to: '/dashboard',
      onClick: actions.modals.newSandboxModal.close,
    };
  };

  return (
    <ThemeProvider>
      <Container {...props}>
        <Stack
          css={css({
            paddingBottom: 4,
          })}
          direction="vertical"
        >
          {hasLogIn ? (
            <DashboardButton {...dashboardButtonAttrs()}>
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
          <Tabs {...tab} aria-label="My tabs">
            <Tab {...tab} stopId="Create">
              <PlusIcon scale={0.5} />
              Create Sandbox
            </Tab>
            <Tab {...tab} stopId="Explore">
              <StarIcon scale={0.5} />
              Explore Templates
            </Tab>
            <Tab {...tab} stopId="Import">
              <UploadIcon scale={0.5} />
              Import Project
            </Tab>
          </Tabs>
        </Stack>
        <TabContent {...tab} stopId="Create">
          {rProps =>
            !rProps.hidden && (
              <div {...rProps}>
                <MobileTabs>
                  {props.isModal ? (
                    <CloseModal
                      type="button"
                      onClick={() => actions.modals.newSandboxModal.close()}
                    >
                      <svg
                        width={10}
                        height={10}
                        fill="none"
                        viewBox="0 0 10 10"
                        {...props}
                      >
                        <path
                          fill="#fff"
                          d="M10 .91L9.09 0 5 4.09.91 0 0 .91 4.09 5 0 9.09l.91.91L5 5.91 9.09 10l.91-.91L5.91 5 10 .91z"
                        />
                      </svg>
                    </CloseModal>
                  ) : null}
                </MobileTabs>

                <Create collectionId={props.collectionId} />
              </div>
            )
          }
        </TabContent>
        <TabContent {...tab} stopId="Explore">
          {rProps =>
            !rProps.hidden && (
              <div {...rProps}>
                <Explore collectionId={props.collectionId} />
              </div>
            )
          }
        </TabContent>
        <TabContent {...tab} stopId="Import">
          {rProps =>
            !rProps.hidden && (
              <div {...rProps}>
                <MobileTabs>
                  {props.isModal ? (
                    <CloseModal
                      type="button"
                      onClick={() => actions.modals.newSandboxModal.close()}
                    >
                      <svg
                        width={10}
                        height={10}
                        fill="none"
                        viewBox="0 0 10 10"
                        {...props}
                      >
                        <path
                          fill="#fff"
                          d="M10 .91L9.09 0 5 4.09.91 0 0 .91 4.09 5 0 9.09l.91.91L5 5.91 9.09 10l.91-.91L5.91 5 10 .91z"
                        />
                      </svg>
                    </CloseModal>
                  ) : null}
                </MobileTabs>
                <Import />
              </div>
            )
          }
        </TabContent>
      </Container>
    </ThemeProvider>
  );
};
