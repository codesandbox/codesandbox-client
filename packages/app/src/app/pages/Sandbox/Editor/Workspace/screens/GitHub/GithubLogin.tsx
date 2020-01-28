import { css } from '@styled-system/css';
import React from 'react';
import {
  Integration,
  Text,
  Element,
  Stack,
  Button,
} from '@codesandbox/components';
import { GitHubIcon } from './Icons';

export const GithubLogin = () => (
  <Integration icon={GitHubIcon} title="GitHub">
    <Element
      marginX={2}
      css={css({
        display: 'grid',
        gridTemplateColumns: '1fr 50px',
        gridGap: 4,
      })}
    >
      <Stack direction="vertical">
        <Text variant="muted">Enables</Text>
        <Text>Commits & PRs</Text>
      </Stack>
      <Button onClick={() => {}}>Sign In</Button>
    </Element>
  </Integration>
);
