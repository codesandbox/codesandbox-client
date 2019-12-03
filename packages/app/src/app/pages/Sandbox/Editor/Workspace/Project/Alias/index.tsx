import { ESC } from '@codesandbox/common/lib/utils/keycodes';
import React, {
  ChangeEvent,
  FunctionComponent,
  KeyboardEvent,
  useState,
} from 'react';

import { useOvermind } from 'app/overmind';

import { WorkspaceInputContainer } from '../../elements';

import { EditPenIcon } from '../elements';

import { SandboxAlias } from './elements';

type Props = {
  editable: boolean;
};
export const Alias: FunctionComponent<Props> = ({ editable }) => {
  const {
    actions: {
      workspace: { sandboxInfoUpdated, valueChanged },
    },
    state: {
      editor: { currentSandbox },
      workspace: { project },
    },
  } = useOvermind();
  const [editing, setEditing] = useState(false);

  const alias = project.alias || currentSandbox.alias;

  return editing ? (
    <WorkspaceInputContainer>
      <input
        onBlur={() => {
          sandboxInfoUpdated();

          setEditing(false);
        }}
        onChange={({ target: { value } }: ChangeEvent<HTMLInputElement>) => {
          valueChanged({ field: 'alias', value });
        }}
        onKeyUp={({ keyCode }: KeyboardEvent<HTMLInputElement>) => {
          if (keyCode === ESC) {
            sandboxInfoUpdated();

            setEditing(false);
          }
        }}
        placeholder="Alias"
        type="text"
        value={alias}
        ref={el => {
          if (el) {
            el.focus();
          }
        }}
      />
    </WorkspaceInputContainer>
  ) : (
    <SandboxAlias>
      {alias}

      {editable && <EditPenIcon onClick={() => setEditing(true)} />}
    </SandboxAlias>
  );
};
