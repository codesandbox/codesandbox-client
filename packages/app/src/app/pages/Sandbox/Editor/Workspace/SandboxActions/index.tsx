import * as React from 'react';
import { connect } from 'app/fluent';

import Button from 'app/components/Button';
import { WorkspaceInputContainer, WorkspaceSubtitle } from '../elements';

import { PrivacySelect, PatronMessage } from './elements';

export default connect()
  .with(({ state, signals }) => ({
    sandbox: state.editor.currentSandbox,
    isPatron: state.isPatron,
    sandboxPrivacyChanged: signals.workspace.sandboxPrivacyChanged,
    modalOpened: signals.modalOpened
  }))
  .to(
    function SandboxActions({ sandbox, isPatron, sandboxPrivacyChanged, modalOpened }) {
      return (
        <div>
          <WorkspaceSubtitle>Set Sandbox Privacy</WorkspaceSubtitle>
          {!isPatron && (
            <PatronMessage>
              Having private and unlisted Sandboxes is available as a{' '}
              <a href="/patron" target="_blank">
                Patron
              </a>.
            </PatronMessage>
          )}
          {isPatron && (
            <WorkspaceInputContainer>
              <PrivacySelect
                value={sandbox.privacy}
                onChange={event =>
                  sandboxPrivacyChanged({
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
              onClick={() =>
                modalOpened({
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

  )
