import React from 'react';
import { inject, observer } from 'mobx-react';

import Button from 'app/components/Button';

import {
  Description,
  WorkspaceInputContainer,
  WorkspaceSubtitle,
} from '../../elements';

const Live = ({ signals, store }) => (
  <div>
    <Description>
      Invite others to live edit this sandbox with you. We{"'"}re doing it live!
    </Description>

    <WorkspaceSubtitle>Create live room</WorkspaceSubtitle>
    <Description>
      To invite others you need to generate a URL that others can join.
    </Description>
    <WorkspaceInputContainer>
      <Button
        onClick={() => {
          signals.live.createLiveClicked({ sandboxId: store.editor.currentId });
        }}
        block
      >
        Go Live
      </Button>
    </WorkspaceInputContainer>
  </div>
);

export default inject('signals', 'store')(observer(Live));
