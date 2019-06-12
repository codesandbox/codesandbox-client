import React, { useState } from 'react';
import { observer } from 'mobx-react-lite';
import { WorkspaceInputContainer } from '../../elements';

import { useSignals } from 'app/store';

import { EditPen } from '../elements';
import { Title } from './elements';

type Props = {
  title: string;
  editable: boolean;
  updateSandboxInfo: () => void;
};

const TitleComponent = ({ title, editable, updateSandboxInfo }: Props) => {
  const [editing, setEditing] = useState(false);
  const { workspace } = useSignals();

  return editing ? (
    <WorkspaceInputContainer style={{ margin: '0 -0.25rem' }}>
      <input
        value={title}
        onChange={event => {
          workspace.valueChanged({
            field: 'title',
            value: event.target.value,
          });
        }}
        type="text"
        onBlur={() => {
          updateSandboxInfo();
          setEditing(false);
        }}
        onKeyUp={event => {
          if (event.keyCode === 13) {
            updateSandboxInfo();
            setEditing(false);
          }
        }}
        ref={el => {
          if (el) {
            el.focus();
          }
        }}
        placeholder="Title"
      />
    </WorkspaceInputContainer>
  ) : (
    <Title>
      {title}
      {editable && <EditPen onClick={() => setEditing(true)} />}
    </Title>
  );
};

export default observer(TitleComponent);
