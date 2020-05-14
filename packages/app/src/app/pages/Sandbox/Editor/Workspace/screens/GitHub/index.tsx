import React, { useEffect } from 'react';
import {
  Collapsible,
  Text,
  Element,
  Stack,
  Link,
} from '@codesandbox/components';
import { githubRepoUrl } from '@codesandbox/common/lib/utils/url-generator';
import { useOvermind } from 'app/overmind';
import { GitHubIcon } from './Icons';
import { CommitForm } from './CommitForm';
import { Changes } from './Changes';
import { CreateRepo } from './CreateRepo';
import { GithubLogin } from './GithubLogin';
import { NotOwner } from './NotOwner';
import { NotLoggedIn } from './NotLoggedIn';

export const GitHub = () => {
  const {
    actions: {
      git: { gitMounted },
    },
    state: {
      git: { isFetching, originalGitChanges: gitChanges },
      editor: {
        currentSandbox: { originalGit, owned },
      },
      isLoggedIn,
      user,
    },
  } = useOvermind();

  useEffect(() => {
    gitMounted();
  }, [gitMounted]);

  const changeCount = gitChanges
    ? gitChanges.added.length +
      gitChanges.modified.length +
      gitChanges.deleted.length
    : 0;

  if (!isLoggedIn) return <NotLoggedIn />;
  if (!owned) return <NotOwner />;
  if (!user.integrations.github) return <GithubLogin />;

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
          <Element>
            <Text size={3} block marginBottom={2} marginX={2}>
              Changes ({isFetching ? '...' : changeCount})
            </Text>
            {!isFetching ? (
              gitChanges && <Changes {...gitChanges} />
            ) : (
              <Element paddingX={2}>
                <Text variant="muted">Fetching changes...</Text>
              </Element>
            )}
            {!isFetching && (
              <>
                {changeCount > 0 && <CommitForm />}
                {changeCount === 0 && (
                  <Element paddingX={2}>
                    <Text variant="muted" weight="bold">
                      There are no changes
                    </Text>
                  </Element>
                )}
              </>
            )}
          </Element>
        </Collapsible>
      ) : null}
      <CreateRepo />
    </>
  );
};
