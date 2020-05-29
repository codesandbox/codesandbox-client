import type { Sandbox } from '@codesandbox/common/es/types';
import * as React from 'react';

import Dependencies from './Dependencies';
import { Container } from './elements';
import ExternalResources from './ExternalResources';
import FileTree from './FileTree';
import { SandboxInfo } from './SandboxInfo';
import Section from './Section';

type Props = {
  sandbox: Sandbox,
  setCurrentModule: (id: string) => void,
  currentModule: string,
};

function Sidebar({ sandbox, setCurrentModule, currentModule }: Props) {
  return (
    <Container>
      <Section title="CodeSandbox" openByDefault>
        <SandboxInfo sandbox={sandbox} />
      </Section>

      <Section title="Files" openByDefault>
        <FileTree
          sandbox={sandbox}
          currentModuleId={currentModule}
          setCurrentModuleId={setCurrentModule}
        />
      </Section>
      <Section title="Dependencies" openByDefault>
        <Dependencies sandbox={sandbox} />
      </Section>
      <Section
        title="External Resources"
        hidden={sandbox.externalResources.length === 0}
      >
        <ExternalResources sandbox={sandbox} />
      </Section>
    </Container>
  );
}

export default Sidebar;
