import React from 'react';
import styled from 'styled-components';

import { inject, observer } from 'mobx-react';
import BuildIcon from 'react-icons/lib/md/build';
import FlaskIcon from 'react-icons/lib/fa/flask';

import Margin from 'common/components/spacing/Margin';
import Button from 'app/components/Button';

import { Description, WorkspaceInputContainer } from '../../elements';

import Status from './Status';

const SubTitle = styled.div`
  text-transform: uppercase;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.6);

  padding-left: 1rem;
  font-size: 0.875rem;
`;

const Task = styled.div`
  transition: 0.3s ease color;

  display: flex;
  color: rgba(255, 255, 255, 0.5);
  cursor: pointer;
  margin-top: 0.25rem;
  margin-bottom: 0.25rem;
  margin-left: 0.25rem;

  align-items: center;
  font-weight: 500;

  svg {
    margin-right: 0.75rem;
    font-size: 1.125em;
    margin-top: 4px;
  }

  &:hover {
    color: white;
  }
`;

class Server extends React.PureComponent {
  render() {
    return (
      <div>
        <Description>
          This sandbox is executed on a server. You can control the server from
          this panel.
        </Description>
        <Description>
          This functionality is in <strong>beta</strong>. It can behave
          differently than you expect, handle with care!
        </Description>

        <Margin top={1}>
          <SubTitle>Status</SubTitle>
          <WorkspaceInputContainer>
            <Status status={this.props.store.server.status} />
          </WorkspaceInputContainer>
        </Margin>

        <Margin top={1.5}>
          <SubTitle>Run Scripts</SubTitle>
          <Margin top={0.5}>
            <WorkspaceInputContainer
              style={{ display: 'flex', flexDirection: 'column' }}
            >
              <Task>
                <BuildIcon /> yarn run build
              </Task>
              <Task>
                <FlaskIcon /> yarn run test
              </Task>
              <Task>
                <BuildIcon /> yarn run kek
              </Task>
            </WorkspaceInputContainer>
          </Margin>
        </Margin>
      </div>
    );
  }
}

export default inject('store')(observer(Server));
