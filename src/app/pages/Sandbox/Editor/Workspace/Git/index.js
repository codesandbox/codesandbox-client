import React from 'react';
import styled from 'styled-components';

import Margin from 'app/components/spacing/Margin';
import GithubBadge from 'app/components/sandbox/GithubBadge';
import { githubRepoUrl } from 'app/utils/url-generator';
import Button from 'app/components/buttons/Button';
import type { Sandbox, GitInfo } from 'common/types';

import TotalChanges from './TotalChanges';
import CommitModal from './modals/Commit';
import WorkspaceSubtitle from '../WorkspaceSubtitle';

type Props = {
  fetchGitChanges: (id: string) => Promise<any>,
  sandboxId: string,
  gitChanges: Sandbox.gitChanges,
  originalGit: GitInfo,
  openModal: (options: Object) => void,
};

const Container = styled.div`color: rgba(255, 255, 255, 0.8);`;

const Buttons = styled.div`
  display: flex;
  margin: 1rem 0rem;

  button {
    margin: 0 0.875rem;
  }
`;

export default class Git extends React.PureComponent<Props> {
  state = {
    showFetchButton: false,
    fetching: false,
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
    this.props.openModal({
      width: 400,
      Body: <CommitModal gitChanges={this.props.gitChanges} />,
    });
  };

  render() {
    const { gitChanges, originalGit } = this.props;
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
            Changes ({gitChanges
              ? gitChanges.added.length +
                gitChanges.modified.length +
                gitChanges.deleted.length
              : '...'})
          </WorkspaceSubtitle>
          {gitChanges ? (
            <Margin top={1}>
              <TotalChanges gitChanges={gitChanges} />

              <Buttons>
                <Button onClick={this.openCommitModal} block small>
                  Commit
                </Button>
                <Button block small>
                  Create PR
                </Button>
              </Buttons>
            </Margin>
          ) : (
            <Margin margin={1}>
              {this.state.showFetchButton && (
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
