import Margin from '@codesandbox/common/lib/components/spacing/Margin';
import { Button } from '@codesandbox/common/lib/components/Button';
import GithubBadge from '@codesandbox/common/lib/components/GithubBadge';
import Input, { TextArea } from '@codesandbox/common/lib/components/Input';
import Notice from '@codesandbox/common/lib/components/Notice';
import { githubRepoUrl } from '@codesandbox/common/lib/utils/url-generator';
import { inject, hooksObserver } from 'app/componentConnectors';
import React, { useEffect } from 'react';

import { WorkspaceSubtitle, WorkspaceInputContainer } from '../../../elements';

import { Container, Buttons, ErrorMessage, NoChanges } from './elements';
import { TotalChanges } from './TotalChanges';

const hasWriteAccess = (rights: 'none' | 'read' | 'write' | 'admin') =>
  ['admin', 'write'].includes(rights);

export const Git = inject('store', 'signals')(
  hooksObserver(
    ({
      signals: {
        git: {
          createCommitClicked,
          createPrClicked,
          descriptionChanged,
          gitMounted,
          subjectChanged,
        },
      },
      store: {
        editor: {
          currentSandbox: { originalGit },
          isAllModulesSynced,
        },
        git: {
          description,
          isFetching,
          originalGitChanges: gitChanges,
          subject,
        },
      },
    }) => {
      useEffect(() => {
        gitMounted();
      }, [gitMounted]);

      const createCommit = () => createCommitClicked();
      const createPR = () => createPrClicked();
      const changeSubject = ({
        target: { value },
      }: React.ChangeEvent<HTMLInputElement>) =>
        subjectChanged({ subject: value });
      const changeDescription = ({
        target: { value },
      }: React.ChangeEvent<HTMLTextAreaElement>) =>
        descriptionChanged({ description: value });

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
              branch={originalGit.branch}
              repo={originalGit.repo}
              url={githubRepoUrl(originalGit)}
              username={originalGit.username}
            />
          </Margin>

          <Margin bottom={0}>
            <WorkspaceSubtitle>
              Changes ({isFetching ? '...' : changeCount})
            </WorkspaceSubtitle>

            {!isFetching ? (
              <Margin top={1}>
                <TotalChanges gitChanges={gitChanges || {}} />

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
                        block
                        onChange={changeSubject}
                        placeholder="Subject"
                        value={subject}
                      />
                    </WorkspaceInputContainer>

                    <WorkspaceInputContainer>
                      <TextArea
                        block
                        onChange={changeDescription}
                        placeholder="Description"
                        value={description}
                      />
                    </WorkspaceInputContainer>

                    <Buttons>
                      {hasWriteAccess(gitChanges.rights) && (
                        <Button
                          block
                          disabled={!subject || modulesNotSaved}
                          onClick={createCommit}
                          small
                        >
                          Commit
                        </Button>
                      )}

                      <Button
                        block
                        disabled={!subject || modulesNotSaved}
                        onClick={createPR}
                        small
                      >
                        Open PR
                      </Button>
                    </Buttons>
                  </Margin>
                ) : (
                  <Margin bottom={1} horizontal={1}>
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
    }
  )
);
