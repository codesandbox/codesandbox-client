import * as React from 'react';
import { connect } from 'app/fluent';

import Margin from 'common/components/spacing/Margin';
import GithubBadge from 'app/components/GithubBadge';
import { githubRepoUrl } from 'common/utils/url-generator';
import Button from 'app/components/Button';
import Input from 'common/components/Input';

import TotalChanges from './TotalChanges';
import { WorkspaceSubtitle, WorkspaceInputContainer } from '../elements';

import { Container, Buttons, ErrorMessage, Notice } from './elements';

function hasWriteAccess(rights) {
  return rights === 'write' || rights === 'admin';
}

export default connect()
  .with(({ state, signals }) => ({
    originalGitChanges: state.git.originalGitChanges,
    isFetching: state.git.isFetching,
    originalGit: state.editor.currentSandbox.originalGit,
    message: state.git.message,
    isAllModulesSynced: state.editor.isAllModulesSynced,
    gitMounted: signals.git.gitMounted,
    createCommitClicked: signals.git.createCommitClicked,
    createPrClicked: signals.git.createPrClicked,
    messageChanged: signals.git.messageChanged
  }))
  .toClass(props =>
    class Git extends React.Component<typeof props> {
      componentDidMount() {
        this.props.gitMounted();
      }
      createCommit = () => {
        this.props.createCommitClicked();
      };

      createPR = () => {
        this.props.createPrClicked();
      };

      changeMessage = event => {
        this.props.messageChanged({
          message: event.target.value,
        });
      };

      render() {
        const { message, originalGitChanges, originalGit, isAllModulesSynced, isFetching } = this.props
        const gitChanges = originalGitChanges;
        const modulesNotSaved = !isAllModulesSynced;
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
              {!isFetching && gitChanges ? (
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
                          value={message}
                          onChange={this.changeMessage}
                          placeholder="Commit message"
                          block
                        />
                      </WorkspaceInputContainer>
                      <Buttons>
                        {hasWriteAccess(gitChanges.rights) && (
                          <Button
                            disabled={!message || modulesNotSaved}
                            onClick={this.createCommit}
                            block
                            small
                          >
                            Commit
                          </Button>
                        )}
                        <Button
                          disabled={!message || modulesNotSaved}
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
  )
