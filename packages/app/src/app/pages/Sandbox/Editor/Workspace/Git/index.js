import React from 'react';
import { inject, observer } from 'mobx-react';

import Margin from 'common/components/spacing/Margin';
import GithubBadge from 'common/components/GithubBadge';
import { githubRepoUrl } from 'common/utils/url-generator';
import Button from 'app/components/Button';
import Input, { TextArea } from 'common/components/Input';

import TotalChanges from './TotalChanges';
import { WorkspaceSubtitle, WorkspaceInputContainer } from '../elements';

import { Container, Buttons, ErrorMessage, Notice } from './elements';

function hasWriteAccess(rights: 'none' | 'read' | 'write' | 'admin') {
  return rights === 'write' || rights === 'admin';
}

class Git extends React.Component {
  componentDidMount() {
    this.props.signals.git.gitMounted();
  }
  createCommit = () => {
    this.props.signals.git.createCommitClicked();
  };

  createPR = () => {
    this.props.signals.git.createPrClicked();
  };

  changeSubject = event => {
    this.props.signals.git.subjectChanged({
      subject: event.target.value,
    });
  };

  changeDescription = event => {
    this.props.signals.git.descriptionChanged({
      description: event.target.value,
    });
  };

  render() {
    const { store } = this.props;
    const gitChanges = store.git.originalGitChanges;
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
          {!store.git.isFetching && gitChanges ? (
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
                  <WorkspaceSubtitle
                    style={{
                      color:
                        store.git.subject.length > 72 ? `#F27777` : `#556362`,
                      textAlign: 'right',
                    }}
                  >
                    {`${store.git.subject.length}/72`}
                  </WorkspaceSubtitle>
                  <WorkspaceInputContainer>
                    <Input
                      value={store.git.subject}
                      onChange={this.changeSubject}
                      placeholder="Subject"
                      block
                    />
                  </WorkspaceInputContainer>
                  <WorkspaceInputContainer>
                    <TextArea
                      value={store.git.description}
                      onChange={this.changeDescription}
                      placeholder="Description"
                      block
                    />
                  </WorkspaceInputContainer>
                  <Buttons>
                    {hasWriteAccess(gitChanges.rights) && (
                      <Button
                        disabled={!store.git.subject || modulesNotSaved}
                        onClick={this.createCommit}
                        block
                        small
                      >
                        Commit
                      </Button>
                    )}
                    <Button
                      disabled={!store.git.subject || modulesNotSaved}
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
              <div>Fetching changes...</div>
            </Margin>
          )}
        </Margin>
      </Container>
    );
  }
}

export default inject('signals', 'store')(observer(Git));
