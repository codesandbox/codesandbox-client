import { inject, hooksObserver } from 'app/componentConnectors';
import React from 'react';

import GithubIntegration from 'app/pages/common/GithubIntegration';

import { Description } from '../../elements';
import WorkspaceItem from '../../WorkspaceItem';

import { CreateRepo } from './CreateRepo';
import { Git } from './Git';
import { More } from '../More';

export const GitHub = inject('store')(
  hooksObserver(({ store }) => {
    const showPlaceHolder =
      !store.editor.currentSandbox.owned || !store.isLoggedIn;

    if (showPlaceHolder) {
      const message = store.isLoggedIn ? (
        <>
          You need to own this sandbox to export this sandbox to GitHub and make
          commits and pull requests to it.{' '}
          <p>Make a fork to own the sandbox.</p>
        </>
      ) : (
        `You need to be signed in to export this sandbox to GitHub and make commits and pull requests to it.`
      );

      return <More message={message} id="github" />;
    }

    const {
      editor: {
        currentSandbox: { originalGit },
      },
      user: {
        integrations: { github },
      },
    } = store;

    return github ? ( // eslint-disable-line
      originalGit ? (
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
      )
    ) : (
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
  })
);
