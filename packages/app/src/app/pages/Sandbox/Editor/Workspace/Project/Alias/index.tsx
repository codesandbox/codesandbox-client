import React, { useState } from 'react';
import { observer } from 'mobx-react-lite';
import { WorkspaceInputContainer } from '../../elements';

import { useSignals } from 'app/store';

import { EditPen } from '../elements';
import { Alias } from './elements';

type Props = {
  alias: string;
  editable: boolean;
  updateSandboxInfo: () => void;
  isPatron: boolean;
};

const AliasComponent = ({
  alias,
  editable,
  updateSandboxInfo,
  isPatron,
}: Props) => {
  const [editing, setEditing] = useState(false);
  const { workspace } = useSignals();

  return isPatron ? (
    <>
      {editing ? (
        <WorkspaceInputContainer>
          <input
            value={workspace.project.alias}
            onChange={event => {
              workspace.valueChanged({
                field: 'alias',
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
            placeholder="Alias"
          />
        </WorkspaceInputContainer>
      ) : (
        <Alias>
          {alias}
          {editable && <EditPen onClick={this.setAliasEditing} />}
        </Alias>
      )}
    </>
  ) : null;
};

export default observer(AliasComponent);
