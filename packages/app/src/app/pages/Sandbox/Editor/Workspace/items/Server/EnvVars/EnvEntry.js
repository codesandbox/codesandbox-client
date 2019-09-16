import React, { useState } from 'react';
import CrossIcon from 'react-icons/lib/md/clear';
import EditIcon from 'react-icons/lib/go/pencil';

import {
  EntryContainer,
  IconArea,
  Icon,
  WorkspaceInputContainer,
} from '../../../elements';
import { EnvironmentIcon, IconWrapper } from './elements';
import { EnvModal } from './EnvModal';

export const EnvEntry = ({ name, onSubmit, onDelete, value }) => {
  const [hovering, setHovering] = useState(false);
  const [editing, setEditing] = useState(false);

  const enableEditing = () => setEditing(true);

  const disableEditing = () => setEditing(false);

  const onSubmitEntry = values => {
    setEditing(false);

    if (values.name !== name) {
      // The name changed, we recreate the env var.
      onDelete(name);
    }
    onSubmit(values);
  };

  const onDeleteEntry = e => {
    e.stopPropagation();
    onDelete(name);
  };

  return editing || !value ? (
    <WorkspaceInputContainer>
      <EnvModal
        onCancel={!value ? undefined : disableEditing}
        onSubmit={onSubmitEntry}
        name={name}
        value={value}
      />
    </WorkspaceInputContainer>
  ) : (
    <EntryContainer
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      onClick={enableEditing}
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
