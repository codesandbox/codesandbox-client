import React from 'react';
import { observer } from 'mobx-react-lite';
import GithubIntegration from 'app/pages/common/GithubIntegration';
import { useStore } from 'app/store';
import WorkspaceItem from '../../WorkspaceItem';
import { Description } from '../../elements';
import { Git } from './Git';
import { CreateRepo } from './CreateRepo';

export const GitHub = observer(() => {
  const {
    editor: {
      currentSandbox: { originalGit },
    },
    user: {
      integrations: { github },
    },
  } = useStore();

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
      <Description margin={1} top={0}>
        You can create commits and open pull requests if you add GitHub to your
        integrations.
      </Description>

      <div style={{ margin: '1rem' }}>
        <GithubIntegration small />
      </div>
    </>
  );
});
