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
import getTemplate from '@codesandbox/common/lib/templates';
import React, { FunctionComponent, useEffect } from 'react';

import { useAppState, useActions } from 'app/overmind';

import { GitHubIcon, FileIcon, VisitIcon } from '../icons';

export const GithubPages: FunctionComponent = () => {
  const {
    isLoadingGithub,
    deployment: { deploying, githubSite },
    user: {
      integrations: { github },
    },
    editor: { currentSandbox },
  } = useAppState();
  const {
    modalOpened,
    signInGithubClicked,
    deployment: { deployWithGitHubPages, fetchGithubSite },
  } = useActions();

  useEffect(() => {
    fetchGithubSite();
  }, []);

  const template = getTemplate(currentSandbox.template);

  if (template.staticDeployment === false) {
    return null;
  }

  return (
    <Integration icon={GitHubIcon} title="GitHub Pages">
      {github ? (
        <>
          <Element marginX={2} marginBottom={githubSite.ghPages ? 6 : 0}>
            <Text variant="muted" block marginBottom={4}>
              Deploy your sandbox to{' '}
              <Link href="https://pages.github.com/" target="_blank">
                GitHub Pages
              </Link>
            </Text>

            <Button disabled={deploying} onClick={deployWithGitHubPages}>
              Deploy to GitHub Pages
            </Button>
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
            </List>
          )}
        </>
      ) : (
        <Stack justify="space-between" marginX={2}>
          <Stack direction="vertical">
            <Text variant="muted">Enables</Text>

            <Text>Deployments</Text>
          </Stack>

          <Button
            autoWidth
            disabled={isLoadingGithub}
            onClick={() => signInGithubClicked()}
          >
            Sign in
          </Button>
        </Stack>
      )}
    </Integration>
  );
};
