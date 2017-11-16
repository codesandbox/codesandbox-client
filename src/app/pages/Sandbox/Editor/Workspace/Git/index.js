// @flow
import React from 'react';
import styled from 'styled-components';

import Margin from 'app/components/spacing/Margin';
import GithubBadge from 'app/components/sandbox/GithubBadge';
import { githubRepoUrl } from 'app/utils/url-generator';
import Button from 'app/components/buttons/Button';
import Input from 'app/components/Input';
import type { Sandbox, GitInfo, CurrentUser } from 'common/types';

import TotalChanges from './TotalChanges';
import CommitModal from './modals/Commit';
import PRModal from './modals/PR';
import WorkspaceSubtitle from '../WorkspaceSubtitle';
import WorkspaceInputContainer from '../WorkspaceInputContainer';

type Props = {
  fetchGitChanges: (id: string) => Promise<any>,
  createGitCommit: (id: string, message: string) => Promise<any>,
  createGitPR: (id: string, message: string) => Promise<any>,
  sandboxId: string,
  gitChanges: $PropertyType<Sandbox, 'originalGitChanges'>,
  originalGit: GitInfo,
  openModal: (options: Object) => void,
  closeModal: () => void,
  user: CurrentUser,
  modulesNotSaved: boolean,
};

const Container = styled.div`color: rgba(255, 255, 255, 0.8);`;

const Buttons = styled.div`
  display: flex;
  margin: 1rem 0.125rem;

  button {
    margin: 0 0.875rem;
  }
`;

const ErrorMessage = styled.div`
  color: ${({ theme }) => theme.red};
  margin: 1rem;
  font-size: 0.875rem;
`;

const Notice = styled.div`
  font-size: 0.75rem;
  color: white;
  padding: 0.125rem 0.2rem;
  background-image: linear-gradient(
    45deg,
    ${({ theme }) => theme.secondary.darken(0.2)} 0%,
    ${({ theme }) => theme.secondary.darken(0.1)} 100%
  );
  border-radius: 4px;
  float: right;
  margin-right: 2rem;
`;

function hasWriteAccess(rights: 'none' | 'read' | 'write' | 'admin') {
  return rights === 'write' || rights === 'admin';
}

type State = {
  showFetchButton: boolean,
  fetching: boolean,
  message: string,
};

export default class Git extends React.PureComponent<Props, State> {
  state = {
    showFetchButton: false,
    fetching: false,

    message: '',
  };

  fetchGitChanges = async () => {
    this.setState({ fetching: true, showFetchButton: false });

    try {
      await this.props.fetchGitChanges(this.props.sandboxId);
    } catch (e) {
      /* no */
    }

    this.setState({ fetching: false });
  };

  componentDidMount() {
    this.fetchGitChanges();
  }

  componentWillReceiveProps(nextProps: Props) {
    if (!nextProps.gitChanges && this.props.gitChanges) {
      this.setState({ showFetchButton: true });
    } else if (nextProps.gitChanges) {
      this.setState({ showFetchButton: false });
    }
  }

  createCommit = () => {
    const {
      sandboxId,
      createGitCommit,
      closeModal,
      user,
      originalGit,
    } = this.props;

    const promise = createGitCommit(sandboxId, this.state.message);
    this.props.openModal({
      width: 400,
      Body: (
        <CommitModal
          promise={promise}
          username={originalGit.username}
          repo={originalGit.repo}
          branch={originalGit.branch}
          closeModal={closeModal}
          newUser={user.username}
        />
      ),
    });
  };

  createPR = () => {
    const {
      sandboxId,
      closeModal,
      createGitPR,
      user,
      originalGit,
    } = this.props;

    const promise = createGitPR(sandboxId, this.state.message);
    this.props.openModal({
      width: 400,
      Body: (
        <PRModal
          promise={promise}
          username={originalGit.username}
          repo={originalGit.repo}
          branch={originalGit.branch}
          closeModal={closeModal}
          newUser={user.username}
        />
      ),
      preventClosing: true,
    });
  };

  changeMessage = (e: KeyboardEvent & { target: { value: string } }) => {
    this.setState({ message: e.target.value });
  };

  render() {
    const { gitChanges, originalGit, modulesNotSaved } = this.props;
    const changeCount = gitChanges
      ? gitChanges.added.length +
        gitChanges.modified.length +
        gitChanges.deleted.length
      : 0;
    return (
      <Container>
        <Notice>beta</Notice>
        <WorkspaceSubtitle>GitHub Repository</WorkspaceSubtitle>
        <Margin margin={1}>
          <GithubBadge
            username={originalGit.username}
            repo={originalGit.repo}
            branch={originalGit.branch}
            url={githubRepoUrl(originalGit)}
          />
        </Margin>
        <Margin bottom={0}>
          <WorkspaceSubtitle>
            Changes ({gitChanges ? changeCount : '...'})
          </WorkspaceSubtitle>
          {gitChanges ? (
            <Margin top={1}>
              <TotalChanges gitChanges={gitChanges} />

              {changeCount > 0 ? (
                <Margin top={1}>
                  <WorkspaceSubtitle>Commit Info</WorkspaceSubtitle>
                  {modulesNotSaved && (
                    <ErrorMessage>
                      You need to save all modules before you can commit
                    </ErrorMessage>
                  )}
                  <WorkspaceInputContainer>
                    <Input
                      value={this.state.message}
                      onChange={this.changeMessage}
                      placeholder="Commit message"
                      block
                    />
                  </WorkspaceInputContainer>
                  <Buttons>
                    {hasWriteAccess(gitChanges.rights) && (
                      <Button
                        disabled={!this.state.message || modulesNotSaved}
                        onClick={this.createCommit}
                        block
                        small
                      >
                        Commit
                      </Button>
                    )}
                    <Button
                      disabled={!this.state.message || modulesNotSaved}
                      onClick={this.createPR}
                      block
                      small
                    >
                      Open PR
                    </Button>
                  </Buttons>
                </Margin>
              ) : (
                <Margin horizontal={1} bottom={1}>
                  <em
                    style={{
                      fontSize: '.875rem',
                      color: 'rgba(255, 255, 255, 0.6)',
                    }}
                  >
                    There are no changes
                  </em>
                </Margin>
              )}
            </Margin>
          ) : (
            <Margin margin={1}>
              {!this.state.fetching &&
                this.state.showFetchButton && (
                  <a
                    style={{ cursor: 'pointer' }}
                    role="button"
                    tabIndex="0"
                    onClick={this.fetchGitChanges}
                  >
                    Fetch Changes
                  </a>
                )}
              {this.state.fetching && <div>Fetching changes...</div>}
            </Margin>
          )}
        </Margin>
      </Container>
    );
  }
}
