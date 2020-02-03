import { EnvironmentVariable } from '@codesandbox/common/lib/types';
import React, {
  FunctionComponent,
  MouseEvent,
  ReactSVGElement,
  useState,
} from 'react';
import CrossIcon from 'react-icons/lib/md/clear';
import EditIcon from 'react-icons/lib/go/pencil';

import { useOvermind } from 'app/overmind';

import {
  EntryContainer,
  IconArea,
  Icon,
  WorkspaceInputContainer,
} from '../../../../elements';
import { EnvironmentIcon, IconWrapper } from './elements';
import { EnvModal } from './EnvModal';

type Props = {
  name: string;
  value: string;
};
export const EnvEntry: FunctionComponent<Props> = ({ name, value }) => {
  const {
    actions: {
      editor: { deleteEnvironmentVariable, updateEnvironmentVariables },
    },
  } = useOvermind();
  const [editing, setEditing] = useState(false);
  const [hovering, setHovering] = useState(false);

  const disableEditing = () => setEditing(false);
  const enableEditing = () => setEditing(true);
  const onDeleteEntry = (event: MouseEvent<ReactSVGElement>) => {
    event.stopPropagation();

    deleteEnvironmentVariable(name);
  };
  const onSubmitEntry = (values: EnvironmentVariable) => {
    setEditing(false);

    if (values.name !== name) {
      // The name changed, we recreate the env var.
      deleteEnvironmentVariable(name);
    }

    updateEnvironmentVariables(values);
  };

  return editing || !value ? (
    <WorkspaceInputContainer>
      <EnvModal
        onCancel={value ? disableEditing : undefined}
        onSubmit={onSubmitEntry}
        name={name}
        value={value}
      />
    </WorkspaceInputContainer>
  ) : (
    <EntryContainer
      onClick={enableEditing}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      <IconWrapper>
        <EnvironmentIcon /> {name}
      </IconWrapper>

      {hovering && (
        <IconArea>
          <Icon>
            <EditIcon onClick={enableEditing} />
          </Icon>

          <Icon>
            <CrossIcon onClick={onDeleteEntry} />
          </Icon>
        </IconArea>
      )}
    </EntryContainer>
  );
};
