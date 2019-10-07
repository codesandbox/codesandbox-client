import React from 'react';
// import { useOvermind } from 'app/overmind';
import { useTabState } from 'reakit/Tab';
import { CodeSandboxIcon, PlusIcon, StarIcon, UploadIcon } from './Icons';
import { Welcome } from './Welcome';
import { Explore } from './Explore';
import { Create } from './Create';
import { Import } from './Import';
import { Container, Tabs, Tab, TabContent, ImportFont } from './elements';

interface INewSandboxModalProps {
  forking: boolean;
  closing: boolean;
  store: any;
  signals: any;
}

export const NewSandboxModal = ({
  forking = false,
  closing = false,
}: INewSandboxModalProps) => {
  const tab = useTabState({
    orientation: 'vertical',
    selectedId: localStorage.getItem('newUser') ? 'Welcome' : 'Create',
  });

  return (
    <>
      <ImportFont />
      <Container closing={closing} forking={forking}>
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
    </>
  );
};
