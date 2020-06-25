import { useOvermind } from 'app/overmind';
import React, { useState, useEffect } from 'react';
import { useTabState } from 'reakit/Tab';
import css from '@styled-system/css';

import latestChangelog from 'homepage/content/changelog';
import { ThemeProvider, Element } from '@codesandbox/components';
import { getInfoFromMarkdown } from './utils/getInfoFromMarkdown';
import { Create } from './Create';
import { Container, Tab, TabContent, Tabs } from './elements';
import { Explore } from './Explore';
import {
  CodeSandboxIcon,
  PlusIcon,
  StarIcon,
  UploadIcon,
  NewIcon,
} from './Icons';
import { Import } from './Import';
import { Welcome } from './Welcome';
import { New } from './New';

export const COLUMN_MEDIA_THRESHOLD = 1600;

export const CreateSandbox: React.FC = props => {
  const {
    state: { isFirstVisit },
    effects: { browser },
  } = useOvermind();
  const [newChangelogToSee, setNewChangelogToSee] = useState(false);
  const tab = useTabState({
    orientation: 'vertical',
    selectedId: isFirstVisit ? 'Welcome' : 'Create',
  });
  const [info, setInfo] = useState(null);

  useEffect(() => {
    if (location.pathname.includes('/repositories')) {
      tab.select('Import');
    }
  }, [tab]);

  useEffect(() => {
    const infoData = getInfoFromMarkdown(latestChangelog);
    setInfo(infoData);
    const key = 'last_changelog_viewed_create_sandbox_modal';
    if (browser.storage.get(key) !== infoData.title) {
      setNewChangelogToSee(true);
    }
    browser.storage.set(key, infoData.title);
  }, [browser.storage]);

  return (
    <ThemeProvider>
      <Container {...props}>
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
                <Create />
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
                <Explore />
              </div>
            )
          }
        </TabContent>
        <TabContent {...tab} stopId="Import">
          {rProps =>
            !rProps.hidden && (
              <div {...rProps}>
                <Import />
              </div>
            )
          }
        </TabContent>
      </Container>
    </ThemeProvider>
  );
};
