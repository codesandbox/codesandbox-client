import React from 'react';
import styled from 'styled-components';

import RecordIcon from 'react-icons/lib/md/fiber-manual-record';
import Input from 'common/components/Input';
import delay from 'common/utils/animation/delay-effect';

import {
  Description,
  WorkspaceInputContainer,
  WorkspaceSubtitle,
} from '../../elements';

const Container = styled.div`
  ${delay()};
  color: rgba(255, 255, 255, 0.7);
  box-sizing: border-box;
`;

const Title = styled.div`
  color: #fd2439fa;
  font-weight: 800;
  display: flex;
  align-items: center;
  justify-content: center;
  vertical-align: middle;

  padding-bottom: 1rem;

  svg {
    margin-right: 0.25rem;
  }
`;

const Separator = styled.hr`
  height: 1px;
  width: 100%;

  background-color: rgba(255, 255, 255, 0.1);
  border: none;
  outline: none;
`;

const StyledInput = styled(Input)`
  width: calc(100% - 1.5rem);
  margin: 0 0.75rem;
  font-size: 0.875rem;
`;

const SubTitle = styled.div`
  text-transform: uppercase;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.5);

  padding-left: 1rem;
  font-size: 0.875rem;
`;

export default class LiveInfo extends React.PureComponent {
  select = e => {
    e.target.select();
  };

  render() {
    const { roomInfo, isOwner } = this.props;
    return (
      <Container>
        <Title>
          <RecordIcon /> {isOwner ? "You've gone live!" : 'You are live!'}
        </Title>
        <Description>
          Share this link with others to invite them to the session:
        </Description>
        <StyledInput
          onFocus={this.select}
          value={`https://codesandbox.io/live/${roomInfo.roomId}`}
        />
        <Separator />

        {isOwner && (
          <div>
            <SubTitle>Session Settings</SubTitle>
          </div>
        )}
      </Container>
    );
  }
}
