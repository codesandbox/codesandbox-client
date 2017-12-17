import React from 'react';
import { inject, observer } from 'mobx-react';
import styled from 'styled-components';

import Button from 'app/components/buttons/Button';
import WorkspaceInputContainer from '../WorkspaceInputContainer';
import WorkspaceSubtitle from '../WorkspaceSubtitle';

const PrivacySelect = styled.select`
  background-color: rgba(0, 0, 0, 0.3);
  color: rgba(255, 255, 255, 0.8);
  border-radius: 4px;
  margin: 0.25rem;
  margin-bottom: 1rem;
  height: 2rem;
  width: 100%;
  border: none;
  box-sizing: border-box;
`;

const PatronMessage = styled.div`
  margin: 0.5rem 1rem;
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.875rem;
`;

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
              signals.editor.sandboxPrivacyChanged({
                privacy: event.target.value,
              })
            }
          >
            <option value={0}>Public</option>
            <option value={1}>Unlisted (only findable with url)</option>
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
          onClick={() => signals.modalOpened({ name: 'deleteSandbox' })}
        >
          Delete Sandbox
        </Button>
      </WorkspaceInputContainer>
    </div>
  );
}

export default inject('signals', 'store')(observer(SandboxActions));
