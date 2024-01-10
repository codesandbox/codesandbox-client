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
import { useGitHubPermissions } from 'app/hooks/useGitHubPermissions';
import { useAppState } from 'app/overmind';
import React from 'react';

import { Changes } from './Changes';
import { CommitForm } from './CommitForm';
import { ClosedPr } from './components/ClosedPr';
import {
  CommitToMaster,
  CommitToPr,
  NoPermissions,
} from './components/CommitText';
import {
  BothModifiedConflict,
  SandboxDeletedConflict,
  SandboxDeletedSourceModifiedConflict,
  SandboxModifiedConflict,
  SourceDeletedConflict,
} from './components/ConflictButtons';
import { ConflictsPRBase } from './components/ConflictPRBase';
import { ConflictsSource } from './components/ConflictsSource';
import { OutOfSync, OutOfSyncPR } from './components/ConflictText';
import { Loading } from './components/Loading';
import { MergedPr } from './components/MergedPr';
import { CreateRepo } from './CreateRepo';
import { GithubLogin } from './GithubLogin';
import { GitHubIcon } from './Icons';
import { NotLoggedIn } from './NotLoggedIn';
import { NotOwner } from './NotOwner';
import { ConflictType } from './types';
import { getConflictIcon } from './utils/getConflictIcon';
import { getConflictText } from './utils/getConflictsText';
import { getConflictType } from './utils/getConflictType';
import { LinkSandbox } from './LinkSandbox';

export const GitHub = () => {
  const {
    git: {
      gitChanges,
      gitState,
      conflicts,
      permission,
      isFetching,
      isExported,
      pr,
    },
    editor: {
      currentSandbox: {
        originalGit,
        baseGit,
        owned,
        originalGitCommitSha,
        prNumber,
        forkedTemplateSandbox,
        forkedFromSandbox,
        privacy,
      },
      modulesByPath,
    },
    isLoggedIn,
  } = useAppState();
  const {
    restrictsPublicRepos,
    restrictsPrivateRepos,
  } = useGitHubPermissions();

  const changeCount = gitChanges
    ? gitChanges.added.length +
      gitChanges.modified.length +
      gitChanges.deleted.length
    : 0;

  const conflictPaths = conflicts.map(conflict => '/' + conflict.filename);

  if (!isLoggedIn) return <NotLoggedIn />;
  if (!owned) return <NotOwner />;
  if (isFetching || isExported) return <Loading />;
  if (pr && pr.merged) return <MergedPr />;
  if (pr && pr.state === 'closed') return <ClosedPr />;

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
      return <OutOfSync />;
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
                    marginBottom={4}
                    css={{ display: 'block' }}
                  >
                    <Stack gap={3} align="center" marginBottom={4}>
                      {getConflictIcon(conflict, modulesByPath)}
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

    if (
      conflictPaths.length ||
      gitChanges.added.length ||
      gitChanges.deleted.length ||
      gitChanges.modified.length
    ) {
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
      <Collapsible title={`Changes (${changeCount})`} defaultOpen>
        <Stack align="center" justify="center" padding={3}>
          <Text size={4}>No changes</Text>
        </Stack>
      </Collapsible>
    );
  }

  // If there's a forkedFromSandbox we use that, otherwise we use the forkedTemplateSandbox
  const upstreamSandbox = forkedFromSandbox || forkedTemplateSandbox;

  const showGitHubLogin =
    (privacy === 0 && restrictsPublicRepos) ||
    (privacy !== 0 && restrictsPrivateRepos);

  return (
    <>
      {showGitHubLogin && <GithubLogin />}

      {originalGit ? (
        <>
          <Collapsible title="GitHub repository" defaultOpen={!showGitHubLogin}>
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

      {!originalGit && upstreamSandbox?.git ? (
        <LinkSandbox
          disabled={showGitHubLogin}
          upstreamSandbox={upstreamSandbox}
        />
      ) : null}

      {/* Always show create repo */}
      <CreateRepo disabled={showGitHubLogin} />
    </>
  );
};
