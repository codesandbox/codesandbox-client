import { ENTER } from '@codesandbox/common/lib/utils/keycodes';
import React, {
  ChangeEvent,
  FunctionComponent,
  KeyboardEvent,
  useState,
} from 'react';

import { useOvermind } from 'app/overmind';

import { EditPen } from '../elements';

import { SandboxDescription, WorkspaceInputContainer } from './elements';

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

  const onKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.keyCode === ENTER && !event.shiftKey) {
      event.preventDefault();
      event.stopPropagation();

      sandboxInfoUpdated();

      setEditing(false);
    }
  };

  return editing ? (
    <WorkspaceInputContainer>
      <textarea
        onBlur={() => {
          sandboxInfoUpdated();

          setEditing(false);
        }}
        onChange={({ target: { value } }: ChangeEvent<HTMLTextAreaElement>) => {
          valueChanged({ field: 'description', value });
        }}
        onKeyDown={onKeyDown}
        placeholder="Description"
        ref={el => {
          if (el) {
            el.focus();
          }
        }}
        rows={2}
        value={description}
      />
    </WorkspaceInputContainer>
  ) : (
    <SandboxDescription empty={Boolean(description)}>
      {description || (editable ? 'No description, create one!' : '')}

      {editable && <EditPen onClick={() => setEditing(true)} />}
    </SandboxDescription>
  );
};
