import { observer } from 'mobx-react-lite';
import React, { useState } from 'react';

import { useSignals, useStore } from 'app/store';

import { WorkspaceInputContainer } from '../../elements';

import { EditPen } from '../elements';

import { SandboxAlias } from './elements';

type IAliasProps = {
  editable: boolean;
};

export const Alias = observer(({ editable }: IAliasProps) => {
  const [editing, setEditing] = useState(false);
  const {
    workspace: { sandboxInfoUpdated, valueChanged },
  } = useSignals();
  const {
    isPatron,
    editor: { currentSandbox },
    workspace: { project },
  } = useStore();

  const alias = project.alias || currentSandbox.alias;

  return isPatron ? (
    <>
      {editing ? (
        <WorkspaceInputContainer>
          <input
            value={alias}
            onChange={event => {
              valueChanged({
                field: 'alias',
                value: event.target.value,
              });
            }}
            type="text"
            onBlur={() => {
              sandboxInfoUpdated();
              setEditing(false);
            }}
            onKeyUp={event => {
              if (event.keyCode === 13) {
                sandboxInfoUpdated();
                setEditing(false);
              }
            }}
            ref={el => {
              if (el) {
                el.focus();
              }
            }}
            placeholder="Alias"
          />
        </WorkspaceInputContainer>
      ) : (
        <SandboxAlias>
          {alias}
          {editable && <EditPen onClick={() => setEditing(true)} />}
        </SandboxAlias>
      )}
    </>
  ) : null;
});
