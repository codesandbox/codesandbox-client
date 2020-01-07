import * as React from 'react';
import type { Sandbox } from '@codesandbox/common/lib/types';

import Margin from '@codesandbox/common/lib/components/spacing/Margin';
import { sandboxUrl } from '@codesandbox/common/lib/utils/url-generator';
import Section from './Section';
import { SandboxInfo } from './SandboxInfo';
import FileTree from './FileTree';
import Dependencies from './Dependencies';
import ExternalResources from './ExternalResources';

import { Container, Button } from './elements';

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
      <Section title="Dependencies">
        <Dependencies sandbox={sandbox} />
      </Section>
      <Section
        title="External Resources"
        hidden={sandbox.externalResources.length === 0}
      >
        <ExternalResources sandbox={sandbox} />
      </Section>

      <Margin horizontal={0.5} vertical={1}>
        <Button
          href={sandboxUrl(sandbox) + '?from-embed'}
          target="_blank"
          rel="noreferrer noopener"
        >
          Edit Sandbox
        </Button>
      </Margin>
    </Container>
  );
}

export default Sidebar;
