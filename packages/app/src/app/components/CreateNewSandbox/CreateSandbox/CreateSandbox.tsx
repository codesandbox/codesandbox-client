import { useOvermind } from 'app/overmind';
import React from 'react';
import { useTabState } from 'reakit/Tab';

import { Create } from './Create';
import { Container, Tab, TabContent, Tabs } from './elements';
import { Explore } from './Explore';
import { CodeSandboxIcon, PlusIcon, StarIcon, UploadIcon } from './Icons';
import { Import } from './Import';
import { Welcome } from './Welcome';

export const COLUMN_MEDIA_THRESHOLD = 1600;

export const CreateSandbox: React.FC = props => {
  const { state } = useOvermind();
  const tab = useTabState({
    orientation: 'vertical',
    selectedId: state.isFirstVisit ? 'Welcome' : 'Create',
  });

  return (
    <Container {...props}>
      <Tabs {...tab} aria-label="My tabs">
        <Tab {...tab} stopId="Welcome">
          <CodeSandboxIcon scale={0.5} />
          Welcome
        </Tab>
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
      <TabContent {...tab} stopId="Welcome">
        {rProps =>
          !rProps.hidden && (
            <div {...rProps}>
              <Welcome goToTab={() => tab.select('Create')} />
            </div>
          )
        }
      </TabContent>
      <TabContent {...tab} stopId="Create">
        {rProps =>
          !rProps.hidden && (
            <div {...rProps}>
              <Create />
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
  );
};
