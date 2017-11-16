import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

import GithubIcon from 'react-icons/lib/go/mark-github';
import TerminalIcon from 'react-icons/lib/go/terminal';

import modalActionCreators from 'app/store/modal/actions';
import {
  newSandboxUrl,
  newReactTypeScriptSandboxUrl,
  newPreactSandboxUrl,
  newVueSandboxUrl,
  newSvelteSandboxUrl,
  importFromGitHubUrl,
  uploadFromCliUrl,
} from 'app/utils/url-generator';

import ReactIcon from '../../components/logos/React';
import PreactIcon from '../../components/logos/Preact';
import VueIcon from '../../components/logos/Vue';
import SvelteIcon from '../../components/logos/Svelte';

import Row from '../../components/flex/Row';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  background-color: ${props => props.theme.background};
`;

const RowContainer = styled(Row)`
  justify-content: center;
  color: rgba(255, 255, 255, 0.8);
  padding-top: 1.5rem;
  &:last-of-type {
    padding-bottom: 1.5rem;
  }
`;

const LogoContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  transition: 0.3s ease all;
  opacity: 0.8;

  padding: 1.5rem 0;

  &:hover {
    opacity: 1;
    background-color: rgba(0, 0, 0, 0.2);
  }
`;

const Text = styled.div`
  margin-top: 1rem;
`;

const LogoLink = styled(Link)`
  text-decoration: none;
  color: rgba(255, 255, 255, 0.8);
  width: 140px;
  margin: 0 1rem;
`;
type LogoProps = {
  Icon: any,
  width: number,
  height: number,
  text: string,
  href: string,
  onClick: () => {},
};

const Logo = ({ Icon, width, height, text, href, onClick }: LogoProps) => (
  <LogoLink to={href} onClick={onClick}>
    <LogoContainer>
      <Icon width={width} height={height} />
      <Text>{text}</Text>
    </LogoContainer>
  </LogoLink>
);

const NewSandbox = ({
  modalActions,
}: {
  modalActions: typeof modalActionCreators | undefined,
}) => (
  <Container>
    <RowContainer>
      <Logo
        Icon={ReactIcon}
        width={50}
        height={50}
        text="React"
        href={newSandboxUrl()}
        onClick={modalActions ? modalActions.closeModal : null}
      />
      <Logo
        Icon={ReactIcon}
        width={50}
        height={50}
        text="React TypeScript"
        href={newReactTypeScriptSandboxUrl()}
        onClick={modalActions ? modalActions.closeModal : null}
      />
      <Logo
        Icon={PreactIcon}
        width={50}
        height={50}
        text="Preact"
        href={newPreactSandboxUrl()}
        onClick={modalActions ? modalActions.closeModal : null}
      />
      <Logo
        Icon={VueIcon}
        width={50}
        height={50}
        text="Vue"
        href={newVueSandboxUrl()}
        onClick={modalActions ? modalActions.closeModal : null}
      />
      <Logo
        Icon={SvelteIcon}
        width={50}
        height={50}
        text="Svelte"
        href={newSvelteSandboxUrl()}
        onClick={modalActions ? modalActions.closeModal : null}
      />
    </RowContainer>
    <RowContainer>
      <Logo
        Icon={GithubIcon}
        width={50}
        height={50}
        text="Import from Github"
        href={importFromGitHubUrl()}
        onClick={modalActions ? modalActions.closeModal : null}
      />
      <Logo
        Icon={TerminalIcon}
        width={50}
        height={50}
        text="Upload from CLI"
        href={uploadFromCliUrl()}
        onClick={modalActions ? modalActions.closeModal : null}
      />
    </RowContainer>
  </Container>
);

export default NewSandbox;
