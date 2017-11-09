import React from 'react';
import styled from 'styled-components';

import Input, { TextArea } from 'app/components/Input';
import Margin from 'app/components/spacing/Margin';
import Row from 'app/components/flex/Row';
import Column from 'app/components/flex/Column';
import Button from 'app/components/buttons/Button';
import type Sandbox from 'common/types';

import TotalChanges from '../TotalChanges';

const Container = styled.div`
  background-color: ${({ theme }) => theme.background2};
  padding: 1rem;
  color: rgba(255, 255, 255, 0.8);
`;

const Title = styled.h2`
  font-size: 1.25rem;
  font-weight: 400;
  margin-top: 0 !important;
  margin-bottom: 1rem;
`;

const SubTitle = styled.h3`
  font-weight: 500;
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.6);
  margin-top: 0;
  margin-bottom: 0.5rem;
`;

const CommitContainer = Margin.extend`font-size: 0.875rem;`;

type Props = {
  gitChanges: Sandbox.originalGitChanges,
};

export default class Commit extends React.PureComponent<Props> {
  state = {
    title: '',
    message: '',
  };

  changeTitle = e => this.setState({ title: e.target.value });
  changeMessage = e => this.setState({ message: e.target.value });

  commit = () => {};

  render() {
    const { gitChanges } = this.props;

    return (
      <Container>
        <Title>Make a commit</Title>
        <SubTitle>Changes</SubTitle>
        <TotalChanges hideColor gitChanges={gitChanges} />

        <CommitContainer top={1}>
          <SubTitle>Commit Info</SubTitle>
          <Margin bottom={0.5} top={0.5}>
            <Input
              block
              placeholder="Commit Title"
              value={this.state.title}
              onChange={this.changeTitle}
            />
          </Margin>
          <TextArea
            block
            placeholder="Commit Message (optional)"
            value={this.state.message}
            onChange={this.changeMessage}
          />
          <Margin top={1}>
            <Button small block>
              Make Commit
            </Button>
          </Margin>
        </CommitContainer>
      </Container>
    );
  }
}
