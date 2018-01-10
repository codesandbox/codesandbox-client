import React from 'react';
import { inject, observer } from 'mobx-react';

import Button from 'app/components/Button';
import Margin from 'common/components/spacing/Margin';

import Git from '../../Git';
import CreateRepo from '../../CreateRepo';
import { WorkspaceInputContainer } from '../../elements';

const GitHub = ({ store, signals }) => {
  const sandbox = store.editor.currentSandbox;

  return store.user.integrations.github ? ( // eslint-disable-line
    sandbox.originalGit ? (
      <Git />
    ) : (
      <CreateRepo />
    )
  ) : (
    <div>
      <Margin margin={1} top={0} style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
        You can create commits and open pull requests if you add GitHub to your
        integrations.
      </Margin>
      <WorkspaceInputContainer>
        <Button
          onClick={() => signals.workspace.integrationsOpened()}
          small
          block
        >
          Open Integrations
        </Button>
      </WorkspaceInputContainer>
    </div>
  );
};

export default inject('signals', 'store')(observer(GitHub));
