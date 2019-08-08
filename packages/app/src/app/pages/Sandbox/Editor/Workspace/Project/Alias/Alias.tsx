import { inject, hooksObserver } from 'app/componentConnectors';
import React, { useState } from 'react';

import { WorkspaceInputContainer } from '../../elements';

import { EditPen } from '../elements';

import { SandboxAlias } from './elements';

type IAliasProps = {
  editable: boolean;
  store: any;
  signals: any;
};

export const Alias = inject('store', 'signals')(
  hooksObserver(
    ({
      editable,
      signals: {
        workspace: { sandboxInfoUpdated, valueChanged },
      },
      store: {
        isPatron,
        editor: { currentSandbox },
        workspace: { project },
      },
    }: IAliasProps) => {
      const [editing, setEditing] = useState(false);

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
    }
  )
);
