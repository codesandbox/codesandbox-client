import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

import OwnerIcon from 'react-icons/lib/ti/user';
import type { Sandbox } from '../../../../../store/entities/sandboxes/entity';

import { sandboxUrl } from '../../../../../utils/url-generator';
import Tooltip from '../../../../../components/Tooltip';

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

const SandboxTitle = styled.h2`
  margin: 0;
  font-weight: 400;
  font-size: 1rem;
  width: 100%;
  text-overflow: ellipsis;
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

export default ({ sandbox }: { sandbox: Sandbox }) => (
  <Container>
    <div>
      <SandboxTitle>
        {sandbox.title || sandbox.id}
      </SandboxTitle>
      {sandbox.forkedFromSandbox &&
        <ForkText>
          Forked from
          {' '}
          <Link to={sandboxUrl(sandbox.forkedFromSandbox)}>
            {sandbox.forkedFromSandbox.title || sandbox.forkedFromSandbox.id}
          </Link>
        </ForkText>}
    </div>

    <Icons>
      {sandbox.owned &&
        <Tooltip left message="You are the owner"><OwnerIcon /></Tooltip>}
    </Icons>
  </Container>
);
