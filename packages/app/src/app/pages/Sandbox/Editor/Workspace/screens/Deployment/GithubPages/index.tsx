import {
  Button,
  List,
  ListAction,
  Element,
  ListItem,
  Integration,
  Link,
  Stack,
  Text,
} from '@codesandbox/components';
import track from '@codesandbox/common/lib/utils/analytics';
import getTemplate from '@codesandbox/common/lib/templates';
import React, { FunctionComponent, useEffect } from 'react';

import { useAppState, useActions } from 'app/overmind';
import { useGitHubPermissions } from 'app/hooks/useGitHubPermissions';
import { Info } from './Info';
import { GitHubIcon, FileIcon, VisitIcon } from '../icons';

export const GithubPages: FunctionComponent = () => {
  const {
    isLoadingGithub,
    deployment: { deploying, githubSite },
    editor: { currentSandbox },
  } = useAppState();
  const {
    modalOpened,
    signInGithubClicked,
    deployment: { deployWithGitHubPages, fetchGithubSite },
  } = useActions();
  const {
    restrictsPublicRepos,
    restrictsPrivateRepos,
  } = useGitHubPermissions();

  useEffect(() => {
    fetchGithubSite();
  }, [fetchGithubSite, currentSandbox.id]);

  const template = getTemplate(currentSandbox.template);

  if (
    template.staticDeployment === false ||
    template.githubPagesDeploy === false
  ) {
    return null;
  }

  const deploy = () => {
    track('Deploy Clicked', { provider: 'github' });
    deployWithGitHubPages();
    modalOpened({ modal: 'githubPagesLogs' });
  };

  const needsPermissions =
    (currentSandbox.privacy === 0 && restrictsPublicRepos) ||
    (currentSandbox.privacy !== 0 && restrictsPrivateRepos);

  return (
    <Integration icon={GitHubIcon} title="GitHub Pages">
      {needsPermissions ? (
        <Stack justify="space-between" marginX={2}>
          <Stack direction="vertical">
            <Text variant="muted">Enables</Text>

            <Text>Deployments</Text>
          </Stack>

          <Button
            autoWidth
            disabled={isLoadingGithub}
            onClick={() =>
              signInGithubClicked(
                currentSandbox.privacy === 0 ? 'public_repos' : 'private_repos'
              )
            }
          >
            Sign in
          </Button>
        </Stack>
      ) : (
        <>
          <Element marginX={2} marginBottom={githubSite.ghPages ? 6 : 0}>
            <Text variant="muted" block marginBottom={4}>
              Deploy your sandbox to{' '}
              <Link href="https://pages.github.com/" target="_blank">
                GitHub
              </Link>
            </Text>

            <Button disabled={deploying} onClick={deploy}>
              Deploy to GitHub
            </Button>
            <Info template={template.name} path={`csb-${currentSandbox.id}`} />
          </Element>
          {githubSite.ghPages && (
            <List>
              <ListItem>
                <Text weight="bold">{githubSite.name}</Text>
              </ListItem>

              <ListAction
                onClick={() =>
                  window.open(
                    `https://${githubSite.ghLogin}.github.io/${githubSite.name}/`,
                    '_blank'
                  )
                }
              >
                <Element marginRight={2}>
                  <VisitIcon />
                </Element>{' '}
                Visit Site
              </ListAction>

              <ListAction
                onClick={() => modalOpened({ modal: 'githubPagesLogs' })}
              >
                <Element marginRight={2}>
                  <FileIcon />
                </Element>{' '}
                View Logs
              </ListAction>
              <ListAction
                onClick={() =>
                  window.open(
                    `https://github.com/${githubSite.ghLogin}/${githubSite.name}/`,
                    '_blank'
                  )
                }
              >
                <Element marginRight={2}>
                  <GitHubIcon />
                </Element>{' '}
                Visit Github Repository
              </ListAction>
            </List>
          )}
        </>
      )}
    </Integration>
  );
};
