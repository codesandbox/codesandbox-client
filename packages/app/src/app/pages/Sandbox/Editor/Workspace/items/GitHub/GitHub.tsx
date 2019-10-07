import React, { FunctionComponent } from 'react';

import { useOvermind } from 'app/overmind';
import { GithubIntegration } from 'app/pages/common/GithubIntegration';

import { Description } from '../../elements';
import { WorkspaceItem } from '../../WorkspaceItem';

import { CreateRepo } from './CreateRepo';
import { Git } from './Git';
import { More } from '../More';

export const GitHub: FunctionComponent = () => {
  const {
    state: {
      editor: {
        currentSandbox: { originalGit, owned },
      },
      isLoggedIn,
      user,
    },
  } = useOvermind();
  const showPlaceHolder = !owned || !isLoggedIn;

  if (showPlaceHolder) {
    const message = isLoggedIn ? (
      <>
        You need to own this sandbox to export this sandbox to GitHub and make
        commits and pull requests to it. <p>Make a fork to own the sandbox.</p>
      </>
    ) : (
      `You need to be signed in to export this sandbox to GitHub and make commits and pull requests to it.`
    );

    return <More message={message} id="github" />;
  }

  if (!user.integrations.github) {
    return (
      <>
        <Description>
          You can create commits and open pull requests if you add GitHub to
          your integrations.
        </Description>

        <div style={{ margin: '1rem' }}>
          <GithubIntegration small />
        </div>
      </>
    );
  }
  return originalGit ? (
    <>
      <Git />

      <WorkspaceItem title="Export to GitHub">
        <CreateRepo />
      </WorkspaceItem>
    </>
  ) : (
    <>
      <Description>Export your sandbox to GitHub.</Description>

      <CreateRepo />
    </>
  );
};
