import { useOvermind } from 'app/overmind';
import React from 'react';
import { useTabState } from 'reakit/Tab';
import { ThemeProvider } from '@codesandbox/components';
import codesandboxBlack from '@codesandbox/components/lib/themes/codesandbox-black';
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
  const { state } = useOvermind();
  const tab = useTabState({
    orientation: 'vertical',
    selectedId: 'New',
    // selectedId: state.isFirstVisit ? 'Welcome' : 'Create',
  });

  return (
    <ThemeProvider theme={codesandboxBlack}>
      <Container {...props}>
        <Tabs {...tab} aria-label="My tabs">
          <Tab {...tab} stopId="New">
            <NewIcon scale={0.5} />
            What{"'"}s new
          </Tab>
          {state.isFirstVisit ? (
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
        {state.isFirstVisit ? (
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
                <New goToTab={() => tab.select('Create')} />
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
