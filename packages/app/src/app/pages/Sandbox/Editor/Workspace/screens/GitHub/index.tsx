import { GitFileCompare, SandboxGitState } from '@codesandbox/common/lib/types';
import { githubRepoUrl } from '@codesandbox/common/lib/utils/url-generator';
import {
  Collapsible,
  Element,
  Link,
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

enum ConflictType {
  SOURCE_ADDED_SANDBOX_DELETED,
  SOURCE_ADDED_SANDBOX_MODIFIED,
  SOURCE_DELETED_SANDBOX_MODIFIED,
  SOURCE_MODIFIED_SANDBOX_MODIFIED,
  SOURCE_MODIFIED_SANDBOX_DELETED,
  UNKNOWN,
}

function getConflictType(
  conflict: GitFileCompare,
  modulesByPath: { [path: string]: any }
) {
  if (conflict.status === 'added' && !modulesByPath['/' + conflict.filename]) {
    return ConflictType.SOURCE_ADDED_SANDBOX_DELETED;
  }
  if (conflict.status === 'added' && modulesByPath['/' + conflict.filename]) {
    return ConflictType.SOURCE_ADDED_SANDBOX_MODIFIED;
  }
  if (conflict.status === 'removed' && modulesByPath['/' + conflict.filename]) {
    return ConflictType.SOURCE_DELETED_SANDBOX_MODIFIED;
  }
  if (
    conflict.status === 'modified' &&
    modulesByPath['/' + conflict.filename]
  ) {
    return ConflictType.SOURCE_MODIFIED_SANDBOX_MODIFIED;
  }
  if (
    conflict.status === 'modified' &&
    !modulesByPath['/' + conflict.filename]
  ) {
    return ConflictType.SOURCE_MODIFIED_SANDBOX_DELETED;
  }

  return ConflictType.UNKNOWN;
}

export const GitHub = () => {
  const {
    state: {
      git: { gitChanges, gitState, conflicts, conflictsResolving },
      editor: {
        currentSandbox: { originalGit, owned },
        modulesByPath,
      },
      isLoggedIn,
      user,
    },
    actions: {
      git: {
        addConflictedFile,
        deleteConflictedFile,
        diffConflictedFile,
        ignoreConflict,
      },
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

  if (gitState === SandboxGitState.SYNCING) {
    return <h4>Loading...</h4>;
  }

  function getConflictText(branch: string, conflict: GitFileCompare) {
    const conflictType = getConflictType(conflict, modulesByPath);

    if (conflictType === ConflictType.SOURCE_ADDED_SANDBOX_DELETED) {
      return `${branch} added this file, but you deleted it`;
    }
    if (conflictType === ConflictType.SOURCE_ADDED_SANDBOX_MODIFIED) {
      return `${branch} added this file, but you modified it`;
    }
    if (conflictType === ConflictType.SOURCE_DELETED_SANDBOX_MODIFIED) {
      return `${branch} deleted this file, but you modified it`;
    }
    if (conflictType === ConflictType.SOURCE_MODIFIED_SANDBOX_MODIFIED) {
      return `${branch} modified this file and you did as well`;
    }
    if (conflictType === ConflictType.SOURCE_MODIFIED_SANDBOX_DELETED) {
      return `${branch} modified this file, but you deleted it`;
    }

    return 'No idea what happened here?';
  }

  function getConflictButtons(conflict: GitFileCompare) {
    const conflictType = getConflictType(conflict, modulesByPath);

    if (conflictType === ConflictType.SOURCE_ADDED_SANDBOX_DELETED) {
      return (
        <>
          <button
            type="button"
            disabled={conflictsResolving.includes(conflict.filename)}
            onClick={() => {
              addConflictedFile(conflict);
            }}
          >
            Add file
          </button>
          <button
            type="button"
            disabled={conflictsResolving.includes(conflict.filename)}
            onClick={() => deleteConflictedFile(conflict)}
          >
            Delete file
          </button>
        </>
      );
    }
    if (conflictType === ConflictType.SOURCE_ADDED_SANDBOX_MODIFIED) {
      return (
        <>
          <button type="button" onClick={() => diffConflictedFile(conflict)}>
            Resolve by diff
          </button>
        </>
      );
    }
    if (conflictType === ConflictType.SOURCE_DELETED_SANDBOX_MODIFIED) {
      return (
        <>
          <button
            type="button"
            disabled={conflictsResolving.includes(conflict.filename)}
            onClick={() => {
              ignoreConflict(conflict);
            }}
          >
            Keep file
          </button>
          <button
            type="button"
            disabled={conflictsResolving.includes(conflict.filename)}
            onClick={() => deleteConflictedFile(conflict)}
          >
            Delete file
          </button>
        </>
      );
    }
    if (conflictType === ConflictType.SOURCE_MODIFIED_SANDBOX_MODIFIED) {
      return (
        <>
          <button type="button" onClick={() => diffConflictedFile(conflict)}>
            Resolve by diff
          </button>
        </>
      );
    }
    if (conflictType === ConflictType.SOURCE_MODIFIED_SANDBOX_DELETED) {
      return (
        <>
          <button
            type="button"
            disabled={conflictsResolving.includes(conflict.filename)}
            onClick={() => addConflictedFile(conflict)}
          >
            Add file
          </button>
          <button
            type="button"
            disabled={conflictsResolving.includes(conflict.filename)}
            onClick={() => ignoreConflict(conflict)}
          >
            Delete file
          </button>
        </>
      );
    }

    return null;
  }

  function getContent() {
    if (gitState === SandboxGitState.CONFLICT_SOURCE) {
      return (
        <Stack direction="vertical">
          <Text size={3} block>
            You are IN CONFLICT with {originalGit.branch}, please click resolve
            to start resolving the issues.
          </Text>
          {conflicts.map(conflict => (
            <div style={{ padding: '1rem', margin: '1rem 0' }}>
              <div>{conflict.filename}</div>
              <div>{getConflictText(originalGit.branch, conflict)}</div>
              <div>
                {conflict.additions} / {conflict.deletions} / {conflict.changes}
              </div>
              <div>{getConflictButtons(conflict)}</div>
            </div>
          ))}
        </Stack>
      );
    }

    if (gitState === SandboxGitState.CONFLICT_PR) {
      return (
        <Stack direction="vertical">
          <Text size={3} block>
            You are IN CONFLICT with the PR, please click resolve to start
            resolving the issues.
          </Text>
          <Changes conflicts={conflictPaths} {...gitChanges} />
          <button
            type="button"
            onClick={() => {
              resolveConflicts();
            }}
          >
            Resolve
          </button>
        </Stack>
      );
    }

    return (
      <>
        <Text size={3} block marginBottom={2} marginX={2}>
          Changes ({changeCount})
        </Text>
        <Changes conflicts={conflictPaths} {...gitChanges} />
        <CommitForm />
      </>
    );
  }

  return (
    <>
      {originalGit ? (
        <Collapsible title="Github" defaultOpen>
          <Element paddingX={2}>
            <Link
              target="_blank"
              rel="noopener noreferrer"
              href={githubRepoUrl(originalGit)}
            >
              <Stack gap={2} marginBottom={6} align="center">
                <GitHubIcon />
                <Text size={2}>
                  {originalGit.username}/{originalGit.repo}
                </Text>
              </Stack>
            </Link>
          </Element>
          <Element>{getContent()}</Element>
        </Collapsible>
      ) : null}
    </>
  );
};
