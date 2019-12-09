import { ENTER } from '@codesandbox/common/lib/utils/keycodes';
import React, { FunctionComponent, useState } from 'react';

import { useOvermind } from 'app/overmind';

import { WorkspaceInputContainer } from '../../elements';

import { EditPen } from '../elements';

import { SandboxDescription } from './elements';

type Props = {
  editable: boolean;
};
export const Description: FunctionComponent<Props> = ({ editable }) => {
  const {
    actions: {
      workspace: { sandboxInfoUpdated, valueChanged },
    },
    state: {
      workspace: {
        project: { description },
      },
    },
  } = useOvermind();
  const [editing, setEditing] = useState(false);

  const onKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.keyCode === ENTER && !event.shiftKey) {
      event.preventDefault();
      event.stopPropagation();
      sandboxInfoUpdated();
      setEditing(false);
    }
  };

  return editing ? (
    <WorkspaceInputContainer style={{ margin: '0 -0.25rem' }}>
      <textarea
        rows={2}
        placeholder="Description"
        value={description}
        ref={el => {
          if (el) {
            el.focus();
          }
        }}
        onKeyDown={onKeyDown}
        onChange={event => {
          valueChanged({
            field: 'description',
            value: event.target.value,
          });
        }}
        onBlur={() => {
          sandboxInfoUpdated();
          setEditing(false);
        }}
      />
    </WorkspaceInputContainer>
  ) : (
    <SandboxDescription empty={Boolean(description)}>
      {description || (editable ? 'No description, create one!' : '')}

      {editable && <EditPen onClick={() => setEditing(true)} />}
    </SandboxDescription>
  );
};
