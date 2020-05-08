import { SandboxGitState } from '@codesandbox/common/lib/types';
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

export const GitHub = () => {
  const {
    state: {
      git: { gitChanges, gitState, conflicts },
      editor: {
        currentSandbox: { originalGit, owned },
      },
      isLoggedIn,
      user,
    },
    actions: {
      git: { resolveConflicts },
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

  function getContent() {
    if (gitState === SandboxGitState.CONFLICT_SOURCE) {
      return (
        <Stack direction="vertical">
          <Text size={3} block>
            You are IN CONFLICT with {originalGit.branch}, please click resolve
            to start resolving the issues.
          </Text>
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
