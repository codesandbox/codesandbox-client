import React from 'react';
import { inject, observer } from 'mobx-react';

import Alert from 'app/components/Alert';
import Button from 'app/components/Button';
import { WorkspaceInputContainer, WorkspaceSubtitle } from '../elements';

import { PrivacySelect, PatronMessage } from './elements';

function SandboxActions({ store, signals }) {
  const sandbox = store.editor.currentSandbox;

  return (
    <div>
      <WorkspaceSubtitle>Sandbox Privacy</WorkspaceSubtitle>
      {!store.isPatron && (
        <PatronMessage>
          Private and unlisted Sandboxes are available as a{' '}
          <a href="/patron" target="_blank">
            Patron
          </a>.
        </PatronMessage>
      )}
      {store.isPatron && (
        <WorkspaceInputContainer>
          <PrivacySelect
            value={sandbox.privacy}
            onChange={event =>
              signals.workspace.sandboxPrivacyChanged({
                privacy: Number(event.target.value),
              })
            }
          >
            <option value={0}>Public</option>
            <option value={1}>Unlisted (only available by url)</option>
            <option value={2}>Private</option>
          </PrivacySelect>
        </WorkspaceInputContainer>
      )}

      <WorkspaceSubtitle>Delete Sandbox</WorkspaceSubtitle>
      <WorkspaceInputContainer>
        <Button
          small
          block
          style={{
            margin: '0.5rem 0.25rem',
            boxSizing: 'border-box',
          }}
          onClick={() =>
            signals.modalOpened({
              modal: 'deleteSandbox',
            })
          }
        >
          Delete Sandbox
        </Button>
      </WorkspaceInputContainer>
    </div>
  );
}

export default inject('signals', 'store')(observer(SandboxActions));
