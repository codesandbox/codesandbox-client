import React, { FunctionComponent } from 'react';
import { Stack, Link, Text } from '@codesandbox/components';
import css from '@styled-system/css';

import { GitProgress } from 'app/components/GitProgress';
import { useOvermind } from 'app/overmind';

const CommitModal: FunctionComponent = () => {
  const {
    state: {
      editor: {
        currentSandbox: { originalGit: git },
      },
      git: { commit },
      user: { username },
    },
  } = useOvermind();

  let message;

  if (commit) {
    if (commit.newBranch) {
      const newUrl = `https://github.com/${git.username}/${git.repo}/compare/${git.branch}...${username}:${commit.newBranch}?expand=1`;

      message = (
        <>
          <Text block marginBottom={6}>
            There was a merge conflict while committing, you can open a PR
            instead.
          </Text>
          <Stack justify="flex-end">
            <Link
              css={css({
                textDecoration: 'none',
                width: 'auto',
              })}
              href={newUrl}
              target="_blank"
              rel="noreferrer noopener"
            >
              Open a PR
            </Link>
          </Stack>
        </>
      );
    } else if (commit.merge) {
      message =
        'Success! There were other commits, so we merged your changes in and opened an up to date sandbox.';
    } else {
      message = 'Successfully created commit!';
    }
  }

  return <GitProgress result={message} message="Creating Commit..." />;
};

export default CommitModal;
