import React from 'react';
import { inject, observer } from 'mobx-react';

import Button from 'app/components/Button';

import Git from '../../Git';
import CreateRepo from '../../CreateRepo';
import { WorkspaceInputContainer, Description } from '../../elements';

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
      <Description
        margin={1}
        top={0}
        style={{ color: 'rgba(255, 255, 255, 0.8)' }}
      >
        You can create commits and open pull requests if you add GitHub to your
        integrations.
      </Description>
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
