import GithubBadge from '@codesandbox/common/lib/components/GithubBadge';
import { githubRepoUrl } from '@codesandbox/common/lib/utils/url-generator';
import React, { FunctionComponent } from 'react';
import { useOvermind } from 'app/overmind';

import { Item } from './elements';

export const Git: FunctionComponent = () => {
  const {
    state: {
      editor: {
        currentSandbox: {
          git,
          git: { branch, commitSha, repo, username },
        },
      },
    },
  } = useOvermind();

  return (
    <Item>
      <GithubBadge
        branch={branch}
        commitSha={commitSha}
        repo={repo}
        url={githubRepoUrl(git)}
        username={username}
      />
    </Item>
  );
};
