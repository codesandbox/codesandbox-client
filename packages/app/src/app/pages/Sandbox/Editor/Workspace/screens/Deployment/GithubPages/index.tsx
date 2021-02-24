import {
  Button,
  Element,
  Integration,
  Link,
  Stack,
  Text,
} from '@codesandbox/components';
import React, { FunctionComponent } from 'react';

import { useOvermind } from 'app/overmind';

import { GitHubIcon } from '../icons';

export const GithubPages: FunctionComponent = () => {
  const {
    actions: {
      signInGithubClicked,
      deployment: { deployWithGitHubPages },
    },
    state: {
      isLoadingGithub,
      deployment: { deploying },
      user: {
        integrations: { github },
      },
    },
  } = useOvermind();

  return (
    <Integration icon={GitHubIcon} title="GitHub Pages">
      {github && github.token ? (
        <Element marginX={2}>
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
