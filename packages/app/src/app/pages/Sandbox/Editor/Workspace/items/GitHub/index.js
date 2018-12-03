import React from 'react';
import { inject, observer } from 'mobx-react';

import GithubIntegration from '../../../../../common/GithubIntegration';
import WorkspaceItem from '../../WorkspaceItem';
import Git from '../../Git';
import CreateRepo from '../../CreateRepo';
import { Description } from '../../elements';

const GitHub = ({ store }) => {
  const sandbox = store.editor.currentSandbox;

  return store.user.integrations.github ? ( // eslint-disable-line
    <React.Fragment>
      {sandbox.originalGit && <Git />}

      <WorkspaceItem
        defaultOpen={!sandbox.originalGit}
        title="Export to GitHub"
      >
        <CreateRepo />
      </WorkspaceItem>
    </React.Fragment>
  ) : (
    <div>
      <Description margin={1} top={0}>
        You can create commits and open pull requests if you add GitHub to your
        integrations.
      </Description>

      <div style={{ margin: '1rem' }}>
        <GithubIntegration small />
      </div>
    </div>
  );
};

export default inject('signals', 'store')(observer(GitHub));
