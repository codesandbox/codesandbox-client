import React from 'react';
import { inject, observer } from 'mobx-react';
import TrashIcon from 'react-icons/lib/fa/trash';
import getTemplate from 'common/lib/templates';

import Button from 'app/components/Button';
import { WorkspaceInputContainer, WorkspaceSubtitle } from '../elements';

import { PrivacySelect, PatronMessage, CenteredText } from './elements';

function SandboxActions({ store, signals }) {
  const sandbox = store.editor.currentSandbox;
  const isServer = getTemplate(sandbox.template).isServer;

  return (
    <div>
      <WorkspaceSubtitle>Set Sandbox Privacy</WorkspaceSubtitle>
      {!store.isPatron && (
        <PatronMessage>
          Having private and unlisted Sandboxes is available as a{' '}
          <a href="/patron" target="_blank">
            Patron
          </a>
          .
        </PatronMessage>
      )}
      {store.isPatron && (
        <React.Fragment>
          {isServer && (
            <PatronMessage style={{ color: 'rgba(255, 255, 255, 0.5)' }}>
              This is a server sandbox, we don
              {"'"}t support private server sandboxes yet.
            </PatronMessage>
          )}
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
              {!isServer && <option value={2}>Private</option>}
            </PrivacySelect>
          </WorkspaceInputContainer>
        </React.Fragment>
      )}

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
