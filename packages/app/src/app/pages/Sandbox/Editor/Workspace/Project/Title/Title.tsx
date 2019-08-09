import React, { useState } from 'react';
import { observer } from 'mobx-react-lite';
import { getSandboxName } from '@codesandbox/common/lib/utils/get-sandbox-name';
import { ESC, ENTER } from '@codesandbox/common/lib/utils/keycodes';
import { useSignals, useStore } from 'app/store';
import { WorkspaceInputContainer } from '../../elements';
import { EditPen } from '../elements';
import { SandboxTitle } from './elements';

type ITitleProps = {
  editable: boolean;
};

export const Title = observer<ITitleProps>(({ editable }) => {
  const [editing, setEditing] = useState(false);
  const {
    editor: { currentSandbox },
    workspace: {
      project: { title },
    },
  } = useStore();
  const {
    workspace: { valueChanged, sandboxInfoUpdated },
  } = useSignals();

  return editing ? (
    <WorkspaceInputContainer style={{ margin: '0 -0.25rem' }}>
      <input
        type="text"
        placeholder="Title"
        ref={el => {
          if (el) {
            el.focus();
          }
        }}
        value={title}
        onChange={event => {
          valueChanged({
            field: 'title',
            value: event.target.value,
          });
        }}
        onBlur={() => {
          sandboxInfoUpdated();
          setEditing(false);
        }}
        onKeyUp={event => {
          if (event.keyCode === ENTER) {
            sandboxInfoUpdated();
            setEditing(false);
          } else if (event.keyCode === ESC) {
            setEditing(false);
          }
        }}
      />
    </WorkspaceInputContainer>
  ) : (
    <SandboxTitle>
      {getSandboxName(currentSandbox)}
      {editable && (
        <EditPen
          onClick={() => {
            valueChanged({
              field: 'title',
              value: getSandboxName(currentSandbox),
            });
            setEditing(true);
          }}
        />
      )}
    </SandboxTitle>
  );
});
