import React from 'react';
import styled from 'styled-components';

import { TextArea } from 'app/components/Input';
import Centered from 'app/components/flex/Centered';
import Margin from 'app/components/spacing/Margin';
import Padding from 'app/components/spacing/Padding';
import Button from 'app/components/buttons/Button';
import GitHubIntegration from 'app/containers/integrations/GitHub';
import IntegrationModal from 'app/containers/modals/IntegrationModal';
import type { Sandbox, CurrentUser } from 'common/types';

import { Added, Modified, Deleted } from '../Changes';

const SubTitle = styled.h3`
  font-weight: 500;
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.6);
  margin-top: 0;
  margin-bottom: 0.5rem;
`;

const CommitContainer = Margin.extend`font-size: 0.875rem;`;

const ChangeColumns = styled.div`display: flex;`;
const ChangeColumn = styled.div`flex: 1;`;
const NoChanges = styled.em`
  display: block;
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.6);
  margin-top: 1rem;
`;

const RadioInput = styled.div`
  margin: 0.5rem 0;
  color: rgba(255, 255, 255, 0.8);
  line-height: 1;
  font-size: 1rem;
  label {
    margin-left: 0.5rem;
  }
`;

type Props = {
  sandboxId: string,
  gitChanges: Sandbox.originalGitChanges,
  createCommit: (id: string, message: string) => void,
  user: CurrentUser,
};

export default class Commit extends React.PureComponent<Props> {
  state = {
    title: '',
  };

  changeTitle = e => this.setState({ title: e.target.value });

  commit = () => {
    this.props.createCommit(this.props.sandboxId, this.state.title);
  };

  render() {
    const { gitChanges, user } = this.props;

    return (
      <IntegrationModal
        name="GitHub"
        Integration={GitHubIntegration}
        title="Source Control"
        subtitle={
          <div>
            Commit your changes directly to{' '}
            <a
              target="_blank"
              rel="noreferrer noopener"
              href="https://github.com"
            >
              GitHub
            </a>
          </div>
        }
        signedIn={user.integrations.github}
      >
        <Padding vertical={2} horizontal={2}>
          <ChangeColumns>
            <ChangeColumn>
              <SubTitle>Added</SubTitle>
              {gitChanges.added.length ? (
                <Added hideColor changes={gitChanges.added} />
              ) : (
                <NoChanges>No Changes</NoChanges>
              )}
            </ChangeColumn>
            <ChangeColumn>
              <SubTitle>Modified</SubTitle>
              {gitChanges.modified.length ? (
                <Modified hideColor changes={gitChanges.modified} />
              ) : (
                <NoChanges>No Changes</NoChanges>
              )}
            </ChangeColumn>
            <ChangeColumn>
              <SubTitle>Deleted</SubTitle>
              {gitChanges.deleted.length ? (
                <Deleted hideColor changes={gitChanges.deleted} />
              ) : (
                <NoChanges>No Changes</NoChanges>
              )}
            </ChangeColumn>
          </ChangeColumns>

          <CommitContainer top={2}>
            <Margin bottom={0.5} top={0.5}>
              <TextArea
                block
                rows="3"
                placeholder="Commit Message"
                value={this.state.title}
                onChange={this.changeTitle}
              />
            </Margin>
            <Margin top={1}>
              <div>
                <RadioInput>
                  <input id="mainBranch" type="radio" />
                  <label htmlFor="mainBranch">Commit directly to master</label>
                </RadioInput>

                <RadioInput>
                  <input id="newBranch" type="radio" />
                  <label htmlFor="newBranch">Create a new branch called</label>
                </RadioInput>
              </div>
              <Button onClick={this.commit}>Make Commit</Button>
            </Margin>
          </CommitContainer>
        </Padding>
      </IntegrationModal>
    );
  }
}
