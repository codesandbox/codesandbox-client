import { Element, Stack, ThemeProvider } from '@codesandbox/components';
import css from '@styled-system/css';
import { useOvermind } from 'app/overmind';
import latestChangelog from 'homepage/content/changelog';
import React, { useEffect, useState } from 'react';
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
  CodeSandboxIcon,
  NewIcon,
  PlusIcon,
  StarIcon,
  UploadIcon,
  BackIcon,
} from './Icons';
import { Import } from './Import';
import { New } from './New';
import { getInfoFromMarkdown } from './utils/getInfoFromMarkdown';
import { Welcome } from './Welcome';

export const COLUMN_MEDIA_THRESHOLD = 1600;

interface CreateSandboxProps {
  collectionId?: string;
  initialTab?: 'Import';
  isModal?: boolean;
}

export const CreateSandbox: React.FC<CreateSandboxProps> = props => {
  const {
    state: { isFirstVisit, hasLogIn },
    effects: { browser },
    actions,
  } = useOvermind();
  const [newChangelogToSee, setNewChangelogToSee] = useState(false);
  const tab = useTabState({
    orientation: 'vertical',
    selectedId:
      props.initialTab ||
      (isFirstVisit && !(window.screen.availWidth < 800)
        ? 'Welcome'
        : 'Create'),
  });
  const [info, setInfo] = useState(null);

  useEffect(() => {
    if (location.pathname.includes('/repositories')) {
      tab.select('Import');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const infoData = getInfoFromMarkdown(latestChangelog);
    setInfo(infoData);
    const key = 'last_changelog_viewed_create_sandbox_modal';
    if (browser.storage.get(key) !== infoData.title) {
      setNewChangelogToSee(true);
    }
    browser.storage.set(key, infoData.title);
  }, [browser.storage]);

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
            <Tab {...tab} stopId="New">
              {newChangelogToSee ? (
                <Element
                  css={css({
                    width: '5px',
                    height: '5px',
                    left: 29,
                    top: 0,
                    transform: 'translateY(100%)',
                    borderRadius: '50%',
                    position: 'absolute',
                    backgroundColor: 'reds.500',
                  })}
                />
              ) : null}
              <NewIcon scale={0.5} />
              What{"'"}s new
            </Tab>
            {isFirstVisit ? (
              <Tab {...tab} stopId="Welcome">
                <CodeSandboxIcon scale={0.5} />
                Welcome
              </Tab>
            ) : null}
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
        {isFirstVisit ? (
          <TabContent {...tab} stopId="Welcome">
            {rProps =>
              !rProps.hidden && (
                <div {...rProps}>
                  <Welcome goToTab={() => tab.select('Create')} />
                </div>
              )
            }
          </TabContent>
        ) : null}
        <TabContent {...tab} stopId="Create">
          {rProps =>
            !rProps.hidden && (
              <div {...rProps}>
                <MobileTabs>
                  <Tab {...tab} className="active" stopId="Create">
                    Create Sandbox
                  </Tab>
                  <Tab {...tab} stopId="Import">
                    Import Project
                  </Tab>
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
        <TabContent {...tab} stopId="New">
          {rProps =>
            !rProps.hidden && (
              <div {...rProps}>
                <New
                  latestChangelog={latestChangelog}
                  info={info}
                  goToTab={() => tab.select('Create')}
                />
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
                  <Tab {...tab} stopId="Create">
                    Create Sandbox
                  </Tab>
                  <Tab className="active" {...tab} stopId="Import">
                    Import Project
                  </Tab>
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
