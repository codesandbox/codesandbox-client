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
import { AddedIcon, ChangedIcon, DeletedIcon, GitHubIcon } from './Icons';
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
      git: {
        gitChanges,
        gitState,
        conflicts,
        conflictsResolving,
        permission,
        isResolving,
        isFetching,
      },
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
    actions: {
      git: {
        addConflictedFile,
        deleteConflictedFile,
        diffConflictedFile,
        ignoreConflict,
        resolveOutOfSync,
      },
    },
    effects,
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

  if (isFetching) {
    return <h4>Loading...</h4>;
  }

  function getConflictIcon(branch: string, conflict: GitFileCompare) {
    const conflictType = getConflictType(conflict, modulesByPath);

    if (
      conflictType === ConflictType.SOURCE_ADDED_SANDBOX_MODIFIED ||
      conflictType === ConflictType.SOURCE_ADDED_SANDBOX_DELETED
    ) {
      return <AddedIcon />;
    }

    if (
      conflictType === ConflictType.SOURCE_MODIFIED_SANDBOX_DELETED ||
      conflictType === ConflictType.SOURCE_MODIFIED_SANDBOX_MODIFIED
    ) {
      return <ChangedIcon />;
    }

    if (conflictType === ConflictType.SOURCE_DELETED_SANDBOX_MODIFIED) {
      return <DeletedIcon />;
    }

    return 'No idea what happened here?';
  }

  function getConflictText(branch: string, conflict: GitFileCompare) {
    const conflictType = getConflictType(conflict, modulesByPath);

    if (conflictType === ConflictType.SOURCE_ADDED_SANDBOX_DELETED) {
      return (
        <Text>
          <Text weight="bold">{branch}</Text> added this file, but you deleted
          it
        </Text>
      );
    }
    if (conflictType === ConflictType.SOURCE_ADDED_SANDBOX_MODIFIED) {
      return (
        <Text>
          <Text weight="bold">{branch}</Text> added this file, but you modified
          it
        </Text>
      );
    }
    if (conflictType === ConflictType.SOURCE_DELETED_SANDBOX_MODIFIED) {
      return (
        <Text>
          <Text weight="bold">{branch}</Text> deleted this file, but you
          modified it
        </Text>
      );
    }
    if (conflictType === ConflictType.SOURCE_MODIFIED_SANDBOX_MODIFIED) {
      return (
        <Text>
          <Text weight="bold">{branch}</Text> modified this file and you did as
          well
        </Text>
      );
    }
    if (conflictType === ConflictType.SOURCE_MODIFIED_SANDBOX_DELETED) {
      return (
        <Text>
          <Text weight="bold">{branch}</Text> modified this file, but you
          deleted it
        </Text>
      );
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
            variant="secondary"
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
            variant="secondary"
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
            variant="secondary"
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

  function getText() {
    if (gitState === SandboxGitState.OUT_OF_SYNC_SOURCE) {
      return (
        <Stack direction="vertical">
          <Text size={3} paddingBottom={4}>
            <Text variant="muted">You are out of sync with changes in </Text>
            {prNumber ? 'PR' : baseGit.branch}
            <Text variant="muted">
              , though you can safely just update the sandbox
            </Text>
          </Text>
          <Button
            loading={isResolving}
            disabled={Boolean(changeCount)}
            onClick={() => {
              resolveOutOfSync();
            }}
          >
            Update sandbox from {prNumber ? 'PR' : baseGit.branch}
          </Button>
          <Button
            marginTop={4}
            variant="link"
            onClick={() => {
              effects.browser.openWindow(
                `https://github.com/${originalGit.username}/${originalGit.repo}/compare/${originalGitCommitSha}...${originalGit.branch}`
              );
            }}
          >
            See changes from {prNumber ? 'PR' : baseGit.branch}
          </Button>
        </Stack>
      );
    }

    if (gitState === SandboxGitState.OUT_OF_SYNC_PR_BASE) {
      return (
        <Stack direction="vertical">
          <Text size={3} paddingBottom={4}>
            <Text variant="muted">You are out of sync with changes on </Text>
            {baseGit.branch}
            <Text variant="muted">
              , though you can safely just update the sandbox
            </Text>
          </Text>
          <Button
            loading={isResolving}
            onClick={() => {
              resolveOutOfSync();
            }}
          >
            Update sandbox from {baseGit.branch}
          </Button>
          <Button
            marginTop={4}
            variant="link"
            onClick={() => {
              effects.browser.openWindow(
                `https://github.com/${originalGit.username}/${originalGit.repo}/compare/${originalGitCommitSha}...${baseGit.branch}`
              );
            }}
          >
            See changes from {baseGit.branch}
          </Button>
        </Stack>
      );
    }

    if (conflicts.length && gitState === SandboxGitState.CONFLICT_SOURCE) {
      return (
        <Stack direction="vertical">
          <Text size={3} paddingBottom={4}>
            <Text variant="muted">You are in conflict with changes on </Text>
            {prNumber ? 'PR' : baseGit.branch}
            <Text variant="muted">
              , please resolve the conflicts and commit your changes
            </Text>
          </Text>
          <Button
            variant="link"
            onClick={() => {
              effects.browser.openWindow(
                `https://github.com/${originalGit.username}/${originalGit.repo}/compare/${originalGitCommitSha}...${originalGit.branch}`
              );
            }}
          >
            See changes from {prNumber ? 'PR' : originalGit.branch}
          </Button>
        </Stack>
      );
    }
    if (conflicts.length && gitState === SandboxGitState.CONFLICT_PR_BASE) {
      return (
        <Stack direction="vertical">
          <Text size={3} paddingBottom={4}>
            <Text variant="muted">
              You are in conflict with changes made on{' '}
            </Text>
            {baseGit.branch}
            <Text variant="muted">
              , please resolve the conflicts and update the{' '}
            </Text>{' '}
            PR
          </Text>
          <Button
            variant="link"
            onClick={() => {
              effects.browser.openWindow(
                `https://github.com/${originalGit.username}/${originalGit.repo}/compare/${originalGitCommitSha}...${baseGit.branch}`
              );
            }}
          >
            See changes from {baseGit.branch}
          </Button>
        </Stack>
      );
    }
    if (!prNumber && (permission === 'admin' || permission === 'write')) {
      return (
        <Text size={3} paddingBottom={4}>
          <Text variant="muted">
            You have access to commit changes directly to{' '}
          </Text>
          {originalGit.branch}
          <Text variant="muted">, but we recommend creating a </Text>PR
        </Text>
      );
    }

    if (prNumber) {
      return (
        <Stack direction="vertical">
          <Text size={3} paddingBottom={4}>
            <Text variant="muted">This</Text> Pull PR{' '}
            <Text variant="muted">is pointing to the branch </Text>
            {originalGit.branch}
            <Text variant="muted">, any updates will be committed there.</Text>
          </Text>
          <Button
            variant="link"
            onClick={() => {
              effects.browser.openWindow(
                `https://github.com/${baseGit.username}/${baseGit.repo}/pull/${prNumber}`
              );
            }}
          >
            Open PR
          </Button>
        </Stack>
      );
    }

    return (
      <Text size={3} paddingBottom={4}>
        <Text variant="muted">
          You do not have access to commit directly to{' '}
        </Text>
        {originalGit.branch}
        <Text variant="muted">, please create a </Text>PR{' '}
        <Text variant="muted">after you have made your changes</Text>
      </Text>
    );
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
                      {getConflictIcon(originalGit.branch, conflict)}
                      <Text variant="muted">{conflict.filename}</Text>
                    </Stack>
                    <Text paddingBottom={4} size={3} block>
                      {getConflictText(
                        gitState === SandboxGitState.CONFLICT_PR_BASE
                          ? baseGit.branch
                          : originalGit.branch,
                        conflict
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
