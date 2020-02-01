import { LiveUser } from '@codesandbox/common/lib/types';
import React, { FunctionComponent } from 'react';
import RemoveIcon from 'react-icons/lib/md/remove';

import { useOvermind } from 'app/overmind';

import { Button } from './Button';

type Props = {
  user: LiveUser;
};
export const MakeSpectatorButton: FunctionComponent<Props> = ({
  user: { id },
}) => {
  const {
    actions: {
      live: { onRemoveEditorClicked },
    },
  } = useOvermind();

  return (
    <Button
      Icon={() => <RemoveIcon onClick={() => onRemoveEditorClicked(id)} />}
      isSecond
      tooltip="Make spectator"
    />
  );
};
