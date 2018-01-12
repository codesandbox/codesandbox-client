import React from 'react';
import { inject, observer } from 'mobx-react';

import Modal from 'app/components/Modal';
import Alert from 'app/components/Alert';
import Button from 'app/components/Button';
import { WorkspaceInputContainer, WorkspaceSubtitle } from '../elements';

import { PrivacySelect, PatronMessage } from './elements';

function SandboxActions({ store, signals }) {
  const sandbox = store.editor.currentSandbox;

  return (
    <div>
      <WorkspaceSubtitle>Set Sandbox Privacy</WorkspaceSubtitle>
      {!store.isPatron && (
        <PatronMessage>
          Having private and unlisted Sandboxes is available as a{' '}
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

      <WorkspaceInputContainer style={{ fontSize: '1rem' }}>
        <Button
          block
          small
          style={{
            margin: '0.75rem 0.25rem',
            boxSizing: 'border-box',
          }}
          onClick={() => signals.workspace.deleteSandboxModalOpened()}
        >
          Delete Sandbox
        </Button>
      </WorkspaceInputContainer>
      <Modal
        isOpen={store.workspace.showDeleteSandboxModal}
        width={400}
        onClose={() => signals.workspace.deleteSandboxModalClosed()}
      >
        <Alert
          title="Delete Sandbox"
          body={<span>Are you sure you want to delete this sandbox?</span>}
          onCancel={() => signals.workspace.deleteSandboxModalClosed()}
          onDelete={() => signals.workspace.sandboxDeleted()}
        />
      </Modal>
    </div>
  );
}

export default inject('signals', 'store')(observer(SandboxActions));
