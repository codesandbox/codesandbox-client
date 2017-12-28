import React from 'react';
import { inject, observer } from 'mobx-react';

import Margin from 'common/components/spacing/Margin';
import Modal from 'app/components/Modal';
import GithubBadge from 'app/components/GithubBadge';
import { githubRepoUrl } from 'common/utils/url-generator';
import Button from 'app/components/Button';
import Input from 'app/components/Input';

import TotalChanges from './TotalChanges';
import CommitModal from './Commit';
import PRModal from './PR';
import { WorkspaceSubtitle, WorkspaceInputContainer } from '../elements';

import { Container, Buttons, ErrorMessage, Notice } from './elements';

function hasWriteAccess(rights: 'none' | 'read' | 'write' | 'admin') {
  return rights === 'write' || rights === 'admin';
}

class Git extends React.Component {
  componentDidMount() {
    this.props.signals.editor.git.gitMounted();
  }
  createCommit = () => {
    this.props.signals.editor.git.createCommitClicked();
  };

  createPR = () => {
    this.props.signals.editor.git.createPrClicked();
  };

  changeMessage = event => {
    this.props.signals.editor.git.messageChanged({
      message: event.target.value,
    });
  };

  render() {
    const { store, signals } = this.props;
    const gitChanges = store.editor.git.originalGitChanges;
    const originalGit = store.editor.currentSandbox.originalGit;
    const modulesNotSaved = !store.editor.isAllModulesSynced;
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
                      value={store.editor.git.message}
                      onChange={this.changeMessage}
                      placeholder="Commit message"
                      block
                    />
                  </WorkspaceInputContainer>
                  <Buttons>
                    {hasWriteAccess(gitChanges.rights) && (
                      <Button
                        disabled={!store.editor.git.message || modulesNotSaved}
                        onClick={this.createCommit}
                        block
                        small
                      >
                        Commit
                      </Button>
                    )}
                    <Button
                      disabled={!store.editor.git.message || modulesNotSaved}
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
              {!store.editor.git.isFetching &&
                store.editor.git.showFetchButton && (
                  <a
                    style={{ cursor: 'pointer' }}
                    role="button"
                    tabIndex="0"
                    onClick={this.fetchGitChanges}
                  >
                    Fetch Changes
                  </a>
                )}
              {store.editor.git.isFetching && <div>Fetching changes...</div>}
            </Margin>
          )}
        </Margin>
        <Modal
          isOpen={store.editor.git.showCreateCommitModal}
          width={400}
          onClose={() =>
            !store.editor.git.isComitting &&
            signals.editor.git.createCommitModalClosed()
          }
        >
          <CommitModal />
        </Modal>
        <Modal
          isOpen={store.editor.git.showPrModal}
          width={400}
          onClose={() =>
            !store.editor.git.isCreatingPr && signals.editor.git.prModalClosed()
          }
        >
          <PRModal />
        </Modal>
      </Container>
    );
  }
}

export default inject('signals', 'store')(observer(Git));
