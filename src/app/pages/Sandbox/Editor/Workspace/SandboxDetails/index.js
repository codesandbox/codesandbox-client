import React from 'react';
import styled from 'styled-components';

import LogoSvg from 'app/components/Logo';
import Tooltip from 'app/components/Tooltip';
import type { Sandbox } from 'app/store/entities/sandboxes/entity';

import SandboxTitle from './SandboxTitle';

const Container = styled.div`
  display: flex;
  position: relative;
  align-items: center;
  justify-content: space-between;
  color: ${props => props.theme.white};
  vertical-align: middle;
  height: 3rem;
  padding: 0 1rem;
  box-sizing: border-box;
  border-bottom: 1px solid ${props => props.theme.background2};
  overflow: hidden;
`;

const LogoLink = styled.a`
  display: flex;
  position: absolute;
  right: 0;
  margin-right: 1rem;
  top: 0;
  bottom: 0;
`;

const CenteredTooltip = styled(Tooltip)`
  display: flex;
  align-items: center;
`;

const UserText = styled.span`
  font-size: .875rem;
  color: rgba(255,255,255,.6);
`;

const Username = styled.b`
  color: rgba(255, 255, 255, .8);
`;

const Logo = styled.div`
  display: relative;
  display: flex;
  align-items: center;
`;

const SandboxInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

type Props = {
  sandbox: Sandbox,
  updateSandboxInfo: (id: string, title: string, description: string) => void,
};

export default class SandboxDetails extends React.PureComponent {
  props: Props;

  renameSandbox = title => {
    const { sandbox, updateSandboxInfo } = this.props;
    updateSandboxInfo(sandbox.id, title, sandbox.description);
  };

  render() {
    const { sandbox } = this.props;
    return (
      <Container>
        <Logo>
          <LogoLink href="/">
            <CenteredTooltip message="CodeSandbox">
              <LogoSvg width="30" height="30" />
            </CenteredTooltip>
          </LogoLink>
          <SandboxInfo>
            <SandboxTitle
              renameSandbox={this.renameSandbox}
              title={sandbox.title || 'Untitled'}
            />
            {(sandbox.author || sandbox.owned) &&
              <UserText>
                By{' '}
                <Username>
                  {sandbox.owned
                    ? 'you!'
                    : <a
                        target="_blank"
                        rel="noopener noreferrer"
                        href={`https://github.com/${sandbox.author.username}`}
                      >
                        {sandbox.author.username}
                      </a>}
                </Username>
              </UserText>}
          </SandboxInfo>
        </Logo>
      </Container>
    );
  }
}
