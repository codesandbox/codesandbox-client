import React, { useState } from 'react';
import { observer } from 'mobx-react-lite';
import { WorkspaceInputContainer } from '../../elements';

import { useSignals } from 'app/store';

import { EditPen } from '../elements';
import { Description } from './elements';

type Props = {
  description: string;
  editable: boolean;
  updateSandboxInfo: () => void;
};

const DescriptionComponent = ({
  description,
  editable,
  updateSandboxInfo,
}: Props) => {
  const [editing, setEditing] = useState(false);
  const { workspace } = useSignals();

  return editing ? (
    <WorkspaceInputContainer style={{ margin: '0 -0.25rem' }}>
      <textarea
        value={description}
        onChange={event => {
          workspace.valueChanged({
            field: 'description',
            value: event.target.value,
          });
        }}
        onBlur={() => {
          updateSandboxInfo();
          setEditing(false);
        }}
        onKeyDown={event => {
          if (event.keyCode === 13) {
            if (!event.shiftKey) {
              event.preventDefault();
              event.stopPropagation();
              updateSandboxInfo();
              setEditing(false);
            }
          }
        }}
        ref={el => {
          if (el) {
            el.focus();
          }
        }}
        rows={2}
        placeholder="Description"
      />
    </WorkspaceInputContainer>
  ) : (
    <Description
      style={{
        fontStyle: description ? 'normal' : 'italic',
      }}
    >
      {description || (editable ? 'No description, create one!' : '')}
      {editable && <EditPen onClick={() => setEditing(true)} />}
    </Description>
  );
};

export default observer(DescriptionComponent);
