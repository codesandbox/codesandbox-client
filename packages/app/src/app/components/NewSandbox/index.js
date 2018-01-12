import React from 'react';
import { inject } from 'mobx-react';
import GithubIcon from 'react-icons/lib/go/mark-github';
import TerminalIcon from 'react-icons/lib/go/terminal';

import {
  newSandboxUrl,
  newReactTypeScriptSandboxUrl,
  newPreactSandboxUrl,
  newVueSandboxUrl,
  newSvelteSandboxUrl,
  importFromGitHubUrl,
  uploadFromCliUrl,
} from 'common/utils/url-generator';

import ReactIcon from 'common/components/logos/React';
import PreactIcon from 'common/components/logos/Preact';
import VueIcon from 'common/components/logos/Vue';
import SvelteIcon from 'common/components/logos/Svelte';

import {
  Container,
  RowContainer,
  LogoContainer,
  Text,
  LogoLink,
} from './elements';

function Logo({ Icon, width, height, text, href, onClick }) {
  return (
    <LogoLink to={href} onClick={onClick}>
      <LogoContainer>
        <Icon width={width} height={height} />
        <Text>{text}</Text>
      </LogoContainer>
    </LogoLink>
  );
}

function NewSandbox({ signals }) {
  return (
    <Container>
      <RowContainer>
        <Logo
          Icon={ReactIcon}
          width={50}
          height={50}
          text="React"
          href={newSandboxUrl()}
          onClick={() => signals.editor.newSandboxModalClosed()}
        />
        <Logo
          Icon={ReactIcon}
          width={50}
          height={50}
          text="React TypeScript"
          href={newReactTypeScriptSandboxUrl()}
          onClick={() => signals.editor.newSandboxModalClosed()}
        />
        <Logo
          Icon={PreactIcon}
          width={50}
          height={50}
          text="Preact"
          href={newPreactSandboxUrl()}
          onClick={() => signals.editor.newSandboxModalClosed()}
        />
        <Logo
          Icon={VueIcon}
          width={50}
          height={50}
          text="Vue"
          href={newVueSandboxUrl()}
          onClick={() => signals.editor.newSandboxModalClosed()}
        />
        <Logo
          Icon={SvelteIcon}
          width={50}
          height={50}
          text="Svelte"
          href={newSvelteSandboxUrl()}
          onClick={() => signals.editor.newSandboxModalClosed()}
        />
      </RowContainer>
      <RowContainer>
        <Logo
          Icon={GithubIcon}
          width={50}
          height={50}
          text="Import from Github"
          href={importFromGitHubUrl()}
          onClick={() => signals.editor.newSandboxModalClosed()}
        />
        <Logo
          Icon={TerminalIcon}
          width={50}
          height={50}
          text="Upload from CLI"
          href={uploadFromCliUrl()}
          onClick={() => signals.editor.newSandboxModalClosed()}
        />
      </RowContainer>
    </Container>
  );
}

export default inject('signals')(NewSandbox);
