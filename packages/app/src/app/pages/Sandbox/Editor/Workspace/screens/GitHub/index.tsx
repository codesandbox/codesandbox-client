import { githubRepoUrl } from '@codesandbox/common/lib/utils/url-generator';
import {
  Collapsible,
  Element,
  Link,
  Stack,
  Text,
} from '@codesandbox/components';
import React, { FunctionComponent, useEffect } from 'react';

import { useOvermind } from 'app/overmind';

import { Changes } from './Changes';
import { CommitForm } from './CommitForm';
import { CreateRepo } from './CreateRepo';
import { GitHubIcon } from './Icons';
import { GithubLogin } from './GithubLogin';
import { NotLoggedIn } from './NotLoggedIn';
import { NotOwner } from './NotOwner';

export const GitHub: FunctionComponent = () => {
  const {
    actions: {
      git: { gitMounted },
    },
    state: {
      editor: {
        currentSandbox: { originalGit, owned },
      },
      git: { isFetching, originalGitChanges },
      isLoggedIn,
      user,
    },
  } = useOvermind();

  useEffect(() => {
    gitMounted();
  }, [gitMounted]);

  const changeCount = originalGitChanges
    ? originalGitChanges.added.length +
      originalGitChanges.modified.length +
      originalGitChanges.deleted.length
    : 0;

  if (!isLoggedIn) {
    return <NotLoggedIn />;
  }

  if (!owned) {
    return <NotOwner />;
  }

  if (!user.integrations.github) {
    return <GithubLogin />;
  }

  return (
    <>
      {originalGit ? (
        <Collapsible defaultOpen title="Github">
          <Element paddingX={2}>
            <Link
              href={githubRepoUrl(originalGit)}
              rel="noopener noreferrer"
              target="_blank"
            >
              <Stack align="center" gap={2} marginBottom={6}>
                <GitHubIcon />

                <Text size={2}>
                  {`${originalGit.username}/${originalGit.repo}`}
                </Text>
              </Stack>
            </Link>
          </Element>

          <Element>
            <Text block marginBottom={2} marginX={2} size={3}>
              {`Changes (${isFetching ? '...' : changeCount})`}
            </Text>

            {!isFetching ? (
              originalGitChanges ? (
                <Changes />
              ) : null
            ) : (
              <Element paddingX={2}>
                <Text variant="muted">Fetching changes...</Text>
              </Element>
            )}

            {!isFetching && (
              <>
                {changeCount > 0 ? <CommitForm /> : null}

                {changeCount === 0 ? (
                  <Element paddingX={2}>
                    <Text variant="muted" weight="bold">
                      There are no changes
                    </Text>
                  </Element>
                ) : null}
              </>
            )}
          </Element>
        </Collapsible>
      ) : null}

      <CreateRepo />
    </>
  );
};
