import React, { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import Margin from '@codesandbox/common/lib/components/spacing/Margin';
import GithubBadge from '@codesandbox/common/lib/components/GithubBadge';
import { githubRepoUrl } from '@codesandbox/common/lib/utils/url-generator';
import { Button } from '@codesandbox/common/lib/components/Button';
import Notice from '@codesandbox/common/lib/components/Notice';
import Input, { TextArea } from '@codesandbox/common/lib/components/Input';
import { useSignals, useStore } from 'app/store';
import { WorkspaceSubtitle, WorkspaceInputContainer } from '../../../elements';
import { TotalChanges } from './TotalChanges';
import { Container, Buttons, ErrorMessage, NoChanges } from './elements';

function hasWriteAccess(rights: 'none' | 'read' | 'write' | 'admin') {
  return rights === 'write' || rights === 'admin';
}

export const Git = observer(() => {
  const {
    git: {
      gitMounted,
      createCommitClicked,
      createPrClicked,
      subjectChanged,
      descriptionChanged,
    },
  } = useSignals();
  const {
    git: { originalGitChanges: gitChanges, isFetching, subject, description },
    editor: {
      currentSandbox: { originalGit },
      isAllModulesSynced,
    },
  } = useStore();

  useEffect(() => {
    gitMounted();
  }, []); // eslint-disable-line

  const createCommit = () => createCommitClicked();
  const createPR = () => createPrClicked();
  const changeSubject = (e: React.ChangeEvent<HTMLInputElement>) =>
    subjectChanged({
      subject: e.target.value,
    });
  const changeDescription = (e: React.ChangeEvent<HTMLInputElement>) =>
    descriptionChanged({
      description: e.target.value,
    });

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
                <WorkspaceSubtitle
                  style={{
                    color: subject.length > 72 ? `#F27777` : `#556362`,
                    textAlign: 'right',
                  }}
                >
                  {`${subject.length}/72`}
                </WorkspaceSubtitle>
                <WorkspaceInputContainer>
                  <Input
                    value={subject}
                    onChange={changeSubject}
                    placeholder="Subject"
                    block
                  />
                </WorkspaceInputContainer>
                <WorkspaceInputContainer>
                  <TextArea
                    value={description}
                    onChange={changeDescription}
                    placeholder="Description"
                    block
                  />
                </WorkspaceInputContainer>
                <Buttons>
                  {hasWriteAccess(gitChanges.rights) && (
                    <Button
                      disabled={!subject || modulesNotSaved}
                      onClick={createCommit}
                      block
                      small
                    >
                      Commit
                    </Button>
                  )}
                  <Button
                    disabled={!subject || modulesNotSaved}
                    onClick={createPR}
                    block
                    small
                  >
                    Open PR
                  </Button>
                </Buttons>
              </Margin>
            ) : (
              <Margin horizontal={1} bottom={1}>
                <NoChanges>There are no changes</NoChanges>
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
});
