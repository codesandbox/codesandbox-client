import * as React from 'react';
import type { Sandbox } from '@codesandbox/common/lib/types';

import Section from './Section';
import { SandboxInfo } from './SandboxInfo';
import FileTree from './FileTree';
import Dependencies from './Dependencies';
import ExternalResources from './ExternalResources';

import { Container } from './elements';

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
