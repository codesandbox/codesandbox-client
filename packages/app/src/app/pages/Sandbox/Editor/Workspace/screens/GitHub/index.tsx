import { GitFileCompare, SandboxGitState } from '@codesandbox/common/lib/types';
import { githubRepoUrl } from '@codesandbox/common/lib/utils/url-generator';
import {
  Collapsible,
  Element,
  Link,
  List,
  ListItem,
  Stack,
  Text,
} from '@codesandbox/components';
import { useOvermind } from 'app/overmind';
import React from 'react';

import { Changes } from './Changes';
import { CommitForm } from './CommitForm';
import { GithubLogin } from './GithubLogin';
import { GitHubIcon } from './Icons';
import { NotLoggedIn } from './NotLoggedIn';
import { NotOwner } from './NotOwner';

import { getConflictType } from './utils/getConflictType';
import { Loading } from './components/Loading';
import { getConflictIcon } from './utils/getConflictIcon';
import { getConflictText } from './utils/getConflictsText';
import { ConflictType } from './types';
import { ConflictsSource } from './components/ConflictsSource';
import { ConflictsPRBase } from './components/ConflictPRBase';
import {
  SandboxDeletedConflict,
  SandboxModifiedConflict,
  SourceDeletedConflict,
  BothModifiedConflict,
  SandboxDeletedSourceModifiedConflict,
} from './components/ConflictButtons';
import { OutOfSync, OutOfSyncPR } from './components/ConflictText';
import {
  CommitToPr,
  CommitToMaster,
  NoPermissions,
} from './components/CommitText';

export const GitHub = () => {
  const {
    state: {
      git: { gitChanges, gitState, conflicts, permission, isFetching },
      editor: {
        currentSandbox: {
          originalGit,
          baseGit,
          owned,
          originalGitCommitSha,
          prNumber,
        },
        modulesByPath,
      },
      isLoggedIn,
      user,
    },
  } = useOvermind();

  const changeCount = gitChanges
    ? gitChanges.added.length +
      gitChanges.modified.length +
      gitChanges.deleted.length
    : 0;

  const conflictPaths = conflicts.map(conflict => '/' + conflict.filename);

  if (!isLoggedIn) return <NotLoggedIn />;
  if (!owned) return <NotOwner />;
  if (!user.integrations.github) return <GithubLogin />;
  if (isFetching) return <Loading />;

  function getConflictButtons(conflict: GitFileCompare) {
    const conflictType = getConflictType(conflict, modulesByPath);

    if (conflictType === ConflictType.SOURCE_ADDED_SANDBOX_DELETED) {
      return <SandboxDeletedConflict conflict={conflict} />;
    }
    if (conflictType === ConflictType.SOURCE_ADDED_SANDBOX_MODIFIED) {
      return <SandboxModifiedConflict conflict={conflict} />;
    }
    if (conflictType === ConflictType.SOURCE_DELETED_SANDBOX_MODIFIED) {
      return <SourceDeletedConflict conflict={conflict} />;
    }
    if (conflictType === ConflictType.SOURCE_MODIFIED_SANDBOX_MODIFIED) {
      return <BothModifiedConflict conflict={conflict} />;
    }
    if (conflictType === ConflictType.SOURCE_MODIFIED_SANDBOX_DELETED) {
      return <SandboxDeletedSourceModifiedConflict conflict={conflict} />;
    }

    return null;
  }

  function getText() {
    if (gitState === SandboxGitState.OUT_OF_SYNC_SOURCE) {
      return <OutOfSync changeCount={changeCount} />;
    }

    if (gitState === SandboxGitState.OUT_OF_SYNC_PR_BASE) {
      return <OutOfSyncPR />;
    }

    if (conflicts.length && gitState === SandboxGitState.CONFLICT_SOURCE) {
      return (
        <ConflictsSource
          prNumber={prNumber}
          baseGit={baseGit}
          originalGit={originalGit}
          originalGitCommitSha={originalGitCommitSha}
        />
      );
    }
    if (conflicts.length && gitState === SandboxGitState.CONFLICT_PR_BASE) {
      return (
        <ConflictsPRBase
          baseGit={baseGit}
          originalGit={originalGit}
          originalGitCommitSha={originalGitCommitSha}
        />
      );
    }
    if (!prNumber && (permission === 'admin' || permission === 'write')) {
      return <CommitToMaster />;
    }

    if (prNumber) {
      return <CommitToPr />;
    }

    return <NoPermissions />;
  }

  function getContent() {
    if (conflicts.length) {
      return (
        <Collapsible title={`Conflicts (${conflictPaths.length})`} defaultOpen>
          <Element>
            <Stack direction="vertical">
              <List paddingBottom={6}>
                {conflicts.map(conflict => (
                  <ListItem
                    gap={2}
                    key={conflict.filename}
                    css={{ display: 'block' }}
                  >
                    <Stack gap={3} align="center" marginBottom={4}>
                      {getConflictIcon(
                        originalGit.branch,
                        conflict,
                        modulesByPath
                      )}
                      <Text variant="muted">{conflict.filename}</Text>
                    </Stack>
                    <Text paddingBottom={4} size={3} block>
                      {getConflictText(
                        gitState === SandboxGitState.CONFLICT_PR_BASE
                          ? baseGit.branch
                          : originalGit.branch,
                        conflict,
                        modulesByPath
                      )}
                    </Text>
                    {getConflictButtons(conflict)}
                  </ListItem>
                ))}
              </List>
            </Stack>
          </Element>
        </Collapsible>
      );
    }

    return (
      <Collapsible title={`Changes (${changeCount})`} defaultOpen>
        <Element>
          <Changes conflicts={conflictPaths} {...gitChanges} />
          <CommitForm />
        </Element>
      </Collapsible>
    );
  }

  return (
    <>
      {originalGit ? (
        <>
          <Collapsible title="Git Repository" defaultOpen>
            <Element paddingX={2}>
              <Link
                target="_blank"
                rel="noopener noreferrer"
                href={githubRepoUrl(originalGit)}
              >
                <Stack gap={2} marginBottom={6} align="center">
                  <GitHubIcon width={20} />
                  <Text size={2}>
                    {originalGit.username}/{originalGit.repo}
                  </Text>
                </Stack>
              </Link>
              {getText()}
            </Element>
          </Collapsible>
          {getContent()}
        </>
      ) : null}
    </>
  );
};
