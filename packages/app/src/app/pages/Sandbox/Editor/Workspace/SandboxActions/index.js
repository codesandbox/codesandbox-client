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
              signals.editor.workspace.sandboxPrivacyChanged({
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
          onClick={() => signals.editor.workspace.deleteSandboxModalOpened()}
        >
          Delete Sandbox
        </Button>
      </WorkspaceInputContainer>
      <Modal
        isOpen={store.editor.workspace.showDeleteSandboxModal}
        width={900}
        onClose={() => signals.editor.workspace.deleteSandboxModalClosed()}
      >
        <Alert
          title="Delete Sandbox"
          body={<span>Are you sure you want to delete this sandbox?</span>}
          onCancel={() => signals.editor.workspace.deleteSandboxModalClosed()}
          onDelete={() => signals.editor.workspace.sandboxDeleted()}
        />
      </Modal>
    </div>
  );
}

export default inject('signals', 'store')(observer(SandboxActions));
