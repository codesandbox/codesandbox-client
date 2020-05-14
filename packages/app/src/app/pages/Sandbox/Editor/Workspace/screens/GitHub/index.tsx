import { GitFileCompare, SandboxGitState } from '@codesandbox/common/lib/types';
import { githubRepoUrl } from '@codesandbox/common/lib/utils/url-generator';
import {
  Button,
  Collapsible,
  Element,
  Link,
  List,
  ListItem,
  Stack,
  Text,
} from '@codesandbox/components';
import css from '@styled-system/css';
import { useOvermind } from 'app/overmind';
import React from 'react';

import { Changes } from './Changes';
import { CommitForm } from './CommitForm';
import { GithubLogin } from './GithubLogin';
import { ChangedIcon, DeletedIcon, GitHubIcon } from './Icons';
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
      git: { gitChanges, gitState, conflicts, conflictsResolving, permission },
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

  function getConflictIcon(branch: string, conflict: GitFileCompare) {
    const conflictType = getConflictType(conflict, modulesByPath);

    if (conflictType === ConflictType.SOURCE_ADDED_SANDBOX_DELETED) {
      return <DeletedIcon />;
    }
    if (
      conflictType === ConflictType.SOURCE_ADDED_SANDBOX_MODIFIED ||
      conflictType === ConflictType.SOURCE_DELETED_SANDBOX_MODIFIED ||
      conflictType === ConflictType.SOURCE_MODIFIED_SANDBOX_MODIFIED
    ) {
      return <ChangedIcon />;
    }
    if (conflictType === ConflictType.SOURCE_MODIFIED_SANDBOX_DELETED) {
      return <DeletedIcon />;
    }

    return 'No idea what happened here?';
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
          <Button
            css={css({ width: 'auto' })}
            type="button"
            variant="secondary"
            disabled={conflictsResolving.includes(conflict.filename)}
            onClick={() => {
              addConflictedFile(conflict);
            }}
          >
            Add file
          </Button>
          <Button
            css={css({ width: 'auto' })}
            variant="danger"
            type="button"
            disabled={conflictsResolving.includes(conflict.filename)}
            onClick={() => deleteConflictedFile(conflict)}
          >
            Delete file
          </Button>
        </>
      );
    }
    if (conflictType === ConflictType.SOURCE_ADDED_SANDBOX_MODIFIED) {
      return (
        <>
          <Button
            css={css({ width: 'auto' })}
            type="button"
            variant="secondary"
            onClick={() => diffConflictedFile(conflict)}
          >
            Resolve by diff
          </Button>
        </>
      );
    }
    if (conflictType === ConflictType.SOURCE_DELETED_SANDBOX_MODIFIED) {
      return (
        <>
          <Button
            css={css({ width: 'auto' })}
            type="button"
            variant="secondary"
            disabled={conflictsResolving.includes(conflict.filename)}
            onClick={() => {
              ignoreConflict(conflict);
            }}
          >
            Keep file
          </Button>
          <Button
            css={css({ width: 'auto' })}
            variant="danger"
            type="button"
            disabled={conflictsResolving.includes(conflict.filename)}
            onClick={() => deleteConflictedFile(conflict)}
          >
            Delete file
          </Button>
        </>
      );
    }
    if (conflictType === ConflictType.SOURCE_MODIFIED_SANDBOX_MODIFIED) {
      return (
        <>
          <Button
            css={css({ width: 'auto' })}
            type="button"
            variant="secondary"
            onClick={() => diffConflictedFile(conflict)}
          >
            Resolve by diff
          </Button>
        </>
      );
    }
    if (conflictType === ConflictType.SOURCE_MODIFIED_SANDBOX_DELETED) {
      return (
        <>
          <Button
            css={css({ width: 'auto' })}
            type="button"
            variant="secondary"
            disabled={conflictsResolving.includes(conflict.filename)}
            onClick={() => addConflictedFile(conflict)}
          >
            Add file
          </Button>
          <Button
            css={css({ width: 'auto' })}
            variant="danger"
            type="button"
            disabled={conflictsResolving.includes(conflict.filename)}
            onClick={() => ignoreConflict(conflict)}
          >
            Delete file
          </Button>
        </>
      );
    }

    return null;
  }

  function getContent() {
    if (gitState === SandboxGitState.CONFLICT_SOURCE) {
      return (
        <Stack direction="vertical">
          <List paddingBottom={6}>
            {conflicts.map(conflict => (
              <ListItem
                gap={2}
                key={conflict.filename}
                css={{ display: 'block' }}
              >
                <Stack gap={3} align="center" marginBottom={4}>
                  {getConflictIcon(originalGit.branch, conflict)}
                  <Text variant="muted">{conflict.filename}</Text>
                </Stack>
                <Text paddingBottom={4} size={3} block>
                  {getConflictText(originalGit.branch, conflict)}
                </Text>
                {getConflictButtons(conflict)}
              </ListItem>
            ))}
          </List>
        </Stack>
      );
    }

    if (gitState === SandboxGitState.CONFLICT_PR) {
      return (
        <Stack direction="vertical" padding={2}>
          <Changes conflicts={conflictPaths} {...gitChanges} />
          <Button
            type="button"
            onClick={() => {
              resolveConflicts();
            }}
          >
            Resolve
          </Button>
        </Stack>
      );
    }

    return (
      <>
        <Changes conflicts={conflictPaths} {...gitChanges} />
        <CommitForm />
      </>
    );
  }

  const title = () => {
    if (gitState === SandboxGitState.CONFLICT_PR) {
      return `Conflicts (${conflictPaths.length})`;
    }
    if (gitState === SandboxGitState.CONFLICT_SOURCE) {
      return `Conflicts (${conflictPaths.length})`;
    }

    return `Changes (${changeCount})`;
  };

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
                {permission === 'admin' || permission === 'write' ? (
                  <Text variant="muted" size={3} paddingBottom={4}>
                    You have access to commit changes directly to{' '}
                    <Text weight="bold">{originalGit.branch}</Text>, but we
                    recommend creating a PR
                  </Text>
                ) : (
                  <Text variant="muted" size={3} paddingBottom={4}>
                    You do not have access to commit directly to{' '}
                    <Text weight="bold">{originalGit.branch}</Text>, please
                    create a PR after you have made your changes.
                  </Text>
                )}
              </Link>
            </Element>
          </Collapsible>
          <Collapsible title={title()} defaultOpen>
            <Element>{getContent()}</Element>
          </Collapsible>
        </>
      ) : null}
    </>
  );
};
