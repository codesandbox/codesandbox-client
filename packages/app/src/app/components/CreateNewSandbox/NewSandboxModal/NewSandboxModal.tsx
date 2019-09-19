import React from 'react';
// import track from '@codesandbox/common/lib/utils/analytics';
// import { Template as TemplateType } from '@codesandbox/common/lib/types';
import { useOvermind } from 'app/overmind';
import { useTabState } from 'reakit/Tab';
import { CodeSandboxIcon, PlusIcon, StarIcon, UploadIcon } from './Icons';
import { Welcome } from './Welcome';
import { Create } from './Create';
import { Import } from './Import';
import { Container, Tabs, Tab, TabContent, Header, Legend } from './elements';

interface INewSandboxModalProps {
  forking: boolean;
  closing: boolean;
  createSandbox: (params: { shortid: string }) => void;
  store: any;
  signals: any;
}

export const NewSandboxModal = ({
  forking = false,
  closing = false,
  createSandbox,
}: INewSandboxModalProps) => {
  const {
    state: { user },
  } = useOvermind();
  const tab = useTabState({
    orientation: 'vertical',
    selectedId: user ? 'Create' : 'Welcome',
  });

  // const selectTemplate = (template: TemplateType) => {
  //   track('New Sandbox Modal - Select Template', { template });
  //   createSandbox(template);
  // };

  return (
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
        <Welcome />
      </TabContent>
      <TabContent {...tab} stopId="Create">
        <Create />
      </TabContent>
      <TabContent {...tab} stopId="Explore">
        <Header>
          <span>My Templates</span>
          <Legend>Show All</Legend>
        </Header>
      </TabContent>
      <TabContent {...tab} stopId="Import">
        <Import />
      </TabContent>
    </Container>
  );
};
