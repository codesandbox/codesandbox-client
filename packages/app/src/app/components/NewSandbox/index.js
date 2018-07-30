import React from 'react';
import { inject } from 'mobx-react';
import GithubIcon from 'react-icons/lib/go/mark-github';
import TerminalIcon from 'react-icons/lib/go/terminal';

import {
  newSandboxUrl,
  parcelSandboxUrl,
  newReactTypeScriptSandboxUrl,
  newPreactSandboxUrl,
  newVueSandboxUrl,
  newAngularSandboxUrl,
  newDojoSandboxUrl,
  newSvelteSandboxUrl,
  newCxJSSandboxUrl,
  importFromGitHubUrl,
  uploadFromCliUrl,
} from 'common/utils/url-generator';

import ReactIcon from 'common/components/logos/React';
import PreactIcon from 'common/components/logos/Preact';
import ParcelIcon from 'common/components/logos/Parcel';
import VueIcon from 'common/components/logos/Vue';
import SvelteIcon from 'common/components/logos/Svelte';
import AngularIcon from 'common/components/logos/Angular';
import CxJSIcon from 'common/components/logos/CxJS';
import DojoIcon from 'common/components/logos/Dojo';

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
          Icon={ParcelIcon}
          width={50}
          height={50}
          text="Vanilla"
          href={parcelSandboxUrl()}
          onClick={() => signals.modalClosed()}
        />
        <Logo
          Icon={ReactIcon}
          width={50}
          height={50}
          text="React"
          href={newSandboxUrl()}
          onClick={() => signals.modalClosed()}
        />
        <Logo
          Icon={VueIcon}
          width={50}
          height={50}
          text="Vue"
          href={newVueSandboxUrl()}
          onClick={() => signals.modalClosed()}
        />
        <Logo
          Icon={AngularIcon}
          width={50}
          height={50}
          text="Angular"
          href={newAngularSandboxUrl()}
          onClick={() => signals.modalClosed()}
        />
        <Logo
          Icon={PreactIcon}
          width={50}
          height={50}
          text="Preact"
          href={newPreactSandboxUrl()}
          onClick={() => signals.modalClosed()}
        />
        <Logo
          Icon={SvelteIcon}
          width={50}
          height={50}
          text="Svelte"
          href={newSvelteSandboxUrl()}
          onClick={() => signals.modalClosed()}
        />
        <Logo
          Icon={ReactIcon}
          width={50}
          height={50}
          text="React TypeScript"
          href={newReactTypeScriptSandboxUrl()}
          onClick={() => signals.modalClosed()}
        />
        <Logo
          Icon={DojoIcon}
          width={50}
          height={50}
          text="Dojo"
          href={newDojoSandboxUrl()}
          onClick={() => signals.modalClosed()}
        />
        <Logo
          Icon={CxJSIcon}
          width={50}
          height={50}
          text="CxJS"
          href={newCxJSSandboxUrl()}
          onClick={() => signals.modalClosed()}
        />
        <Logo
          Icon={GithubIcon}
          width={50}
          height={50}
          text="Import from Github"
          href={importFromGitHubUrl()}
          onClick={() => signals.modalClosed()}
        />
        <Logo
          Icon={TerminalIcon}
          width={50}
          height={50}
          text="Upload from CLI"
          href={uploadFromCliUrl()}
          onClick={() => signals.modalClosed()}
        />
      </RowContainer>
    </Container>
  );
}

export default inject('signals')(NewSandbox);
