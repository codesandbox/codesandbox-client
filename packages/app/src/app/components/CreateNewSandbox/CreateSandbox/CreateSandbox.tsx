import React from 'react';
import { useTabState } from 'reakit/Tab';
import { CodeSandboxIcon, PlusIcon, StarIcon, UploadIcon } from './Icons';
import { Welcome } from './Welcome';
import { Create } from './Create';
import { Explore } from './Explore';
import { Import } from './Import';
import { Container, Tabs, Tab, TabContent } from './elements';

export const CreateSandbox: React.FC = props => {
  const tab = useTabState({ orientation: 'vertical', selectedId: 'Explore' });

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
        <Welcome goToTab={() => tab.select('Create')} />
      </TabContent>
      <TabContent {...tab} stopId="Create">
        <Create />
      </TabContent>
      <TabContent {...tab} stopId="Explore">
        <Explore />
      </TabContent>
      <TabContent {...tab} stopId="Import">
        <Import />
      </TabContent>
    </Container>
  );
};
