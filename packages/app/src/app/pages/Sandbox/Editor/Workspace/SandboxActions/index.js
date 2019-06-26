import React from 'react';
import { inject, observer } from 'mobx-react';
import TrashIcon from 'react-icons/lib/fa/trash';
import { Button } from '@codesandbox/common/lib/components/Button';

import { WorkspaceInputContainer } from '../elements';
import { CenteredText } from './elements';

function SandboxActions({ signals }) {
  return (
    <div>
      <WorkspaceInputContainer style={{ fontSize: '1rem' }}>
        <Button
          block
          small
          danger
          style={{
            margin: '0.75rem 0.25rem',
            boxSizing: 'border-box',
          }}
          onClick={() =>
            signals.modalOpened({
              modal: 'deleteSandbox',
            })
          }
        >
          <CenteredText>
            <TrashIcon />
            <span>Delete Sandbox</span>
          </CenteredText>
        </Button>
      </WorkspaceInputContainer>
    </div>
  );
}

export default inject('signals', 'store')(observer(SandboxActions));
