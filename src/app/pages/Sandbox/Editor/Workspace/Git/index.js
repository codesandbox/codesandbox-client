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
import WorkspaceSubtitle from '../WorkspaceSubtitle';
import WorkspaceInputContainer from '../WorkspaceInputContainer';

type Props = {
  fetchGitChanges: (id: string) => Promise<any>,
  createGitCommit: (id: string, message: string) => Promise<any>,
  createGitPR: (id: string, message: string) => Promise<any>,
  sandboxId: string,
  gitChanges: Sandbox.gitChanges,
  originalGit: GitInfo,
  openModal: (options: Object) => void,
  user: CurrentUser,
};

const Container = styled.div`color: rgba(255, 255, 255, 0.8);`;

const Buttons = styled.div`
  display: flex;
  margin: 1rem 0.125rem;

  button {
    margin: 0 0.875rem;
  }
`;

function hasWriteAccess(rights: 'none' | 'read' | 'write' | 'admin') {
  return rights === 'write' || rights === 'admin';
}

export default class Git extends React.PureComponent<Props> {
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

  openCommitModal = () => {
    const { user } = this.props;
    this.props.openModal({
      width: 800,
      Body: (
        <CommitModal
          sandboxId={this.props.sandboxId}
          createCommit={this.props.createGitCommit}
          gitChanges={this.props.gitChanges}
          user={user}
        />
      ),
    });
  };

  createPR = () => {
    const { sandboxId, createGitPR } = this.props;

    createGitPR(sandboxId, 'Hello PR!');
  };

  changeMessage = e => {
    this.setState({ message: e.target.value });
  };

  render() {
    const { gitChanges, originalGit } = this.props;
    const changeCount = gitChanges
      ? gitChanges.added.length +
        gitChanges.modified.length +
        gitChanges.deleted.length
      : 0;
    return (
      <Container>
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
                      <Button onClick={this.openCommitModal} block small>
                        Commit
                      </Button>
                    )}
                    <Button onClick={this.createPR} block small>
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
