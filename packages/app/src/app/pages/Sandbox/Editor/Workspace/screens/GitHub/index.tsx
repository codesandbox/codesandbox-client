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
      git: { gitChanges, originalGitChanges, pr, gitState },
      editor: {
        currentSandbox: { originalGit, owned },
      },
      isLoggedIn,
      user,
    },
    actions: {
      git: { resolveOutOfSyncPR, updateOutOfSyncPR },
    },
  } = useOvermind();

  const changeCount = gitChanges
    ? gitChanges.added.length +
      gitChanges.modified.length +
      gitChanges.deleted.length
    : 0;

  if (!isLoggedIn) return <NotLoggedIn />;
  if (!owned) return <NotOwner />;
  if (!user.integrations.github) return <GithubLogin />;

  const originalChanges = Object.values(originalGitChanges).reduce(
    (aggr, file) => {
      aggr[file.status].push(file.filename);

      return aggr;
    },
    { added: [], deleted: [], modified: [] }
  );

  const originalChangeCount = originalChanges
    ? originalChanges.added.length +
      originalChanges.modified.length +
      originalChanges.deleted.length
    : 0;

  if (gitState === SandboxGitState.SYNCING) {
    return <h4>Loading...</h4>;
  }

  if (!pr) {
    return <h1>Create PR</h1>;
  }

  function getContent() {
    if (gitState === SandboxGitState.OUT_OF_SYNC_PR) {
      return (
        <Stack direction="vertical">
          <Text size={3} block>
            You are out of sync with the PR, click update to get the latest
            code.
          </Text>
          <button type="button" onClick={() => updateOutOfSyncPR()}>
            Update
          </button>
          <Text size={3} block marginTop={4} marginBottom={2} marginX={2}>
            PR Changes ({originalChangeCount})
          </Text>
          <Changes {...originalChanges} />
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
          <button type="button" onClick={() => resolveOutOfSyncPR()}>
            Resolve
          </button>
          <Text size={3} block marginTop={4} marginBottom={2} marginX={2}>
            PR Changes ({originalChangeCount})
          </Text>
          <Changes {...originalChanges} />
        </Stack>
      );
    }

    if (gitState === SandboxGitState.RESOLVING) {
      return (
        <Stack direction="vertical">
          <Text size={3} block>
            Resolving conflict with PR
          </Text>
          <button type="button" onClick={() => updateOutOfSyncPR()}>
            Resolved!
          </button>
          <Text size={3} block marginTop={4} marginBottom={2} marginX={2}>
            PR Changes ({originalChangeCount})
          </Text>
          <Changes {...originalChanges} />
        </Stack>
      );
    }

    return (
      <>
        <Text size={3} block marginBottom={2} marginX={2}>
          Local Changes ({changeCount})
        </Text>
        <Changes {...gitChanges} />
        {changeCount > 0 && <CommitForm />}
        {changeCount === 0 && (
          <Element paddingX={2}>
            <Text variant="muted" weight="bold">
              There are no local changes
            </Text>
          </Element>
        )}
        <Text size={3} block marginTop={4} marginBottom={2} marginX={2}>
          PR Changes ({originalChangeCount})
        </Text>
        <Changes {...originalChanges} />
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
