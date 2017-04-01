import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

import OwnerIcon from 'react-icons/lib/ti/user';
import { sandboxUrl } from 'app/utils/url-generator';
import Tooltip from 'app/components/Tooltip';
import type { Sandbox } from 'app/store/entities/sandboxes/entity';

import SandboxTitle from './SandboxTitle';

const Container = styled.div`
  display: flex;
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

const ForkText = styled.span`
  font-size: .875rem;
  color: rgba(255,255,255,.5);
`;

const Icons = styled.div`
  display: flex;
  vertical-align: middle;
  line-height: 1;
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
        <div>
          <SandboxTitle
            renameSandbox={this.renameSandbox}
            title={sandbox.title || 'Untitled'}
          />
          {sandbox.forkedFromSandbox &&
            <ForkText>
              Forked from
              {' '}
              <Link to={sandboxUrl(sandbox.forkedFromSandbox)}>
                {sandbox.forkedFromSandbox.title ||
                  sandbox.forkedFromSandbox.id}
              </Link>
            </ForkText>}
        </div>

        <Icons>
          {sandbox.owned &&
            <Tooltip left message="You are the owner"><OwnerIcon /></Tooltip>}
        </Icons>
      </Container>
    );
  }
}
