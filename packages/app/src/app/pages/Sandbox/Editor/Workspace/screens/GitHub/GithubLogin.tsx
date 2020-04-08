import {
  Button,
  Collapsible,
  Element,
  Integration,
  Stack,
  Text,
} from '@codesandbox/components';
import css from '@styled-system/css';
import React, { FunctionComponent } from 'react';

import { useOvermind } from 'app/overmind';

import { GitHubIcon } from './Icons';

export const GithubLogin: FunctionComponent = () => {
  const {
    actions: { signInGithubClicked },
    state: { isLoadingGithub },
  } = useOvermind();

  return (
    <Collapsible defaultOpen title="Github">
      <Element paddingX={2}>
        <Text block marginBottom={4} variant="muted">
          You can create commits and open pull requests if you add GitHub to
          your integrations.
        </Text>

        <Integration icon={GitHubIcon} title="GitHub">
          <Element
            css={css({
              display: 'grid',
              gridTemplateColumns: '1fr auto',
              gridGap: 4,
            })}
            marginX={2}
          >
            <Stack direction="vertical">
              <Text variant="muted">Enables</Text>

              <Text>Commits & PRs</Text>
            </Stack>

            <Button disabled={isLoadingGithub} onClick={signInGithubClicked}>
              Sign In
            </Button>
          </Element>
        </Integration>
      </Element>
    </Collapsible>
  );
};
