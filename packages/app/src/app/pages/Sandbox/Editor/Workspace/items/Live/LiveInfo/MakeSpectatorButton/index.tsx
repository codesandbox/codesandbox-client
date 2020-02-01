import Tooltip from '@codesandbox/common/lib/components/Tooltip';
import { LiveUser } from '@codesandbox/common/lib/types';
import React, { FunctionComponent } from 'react';
import RemoveIcon from 'react-icons/lib/md/remove';

import { useOvermind } from 'app/overmind';

import { IconContainer } from './elements';

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
    <IconContainer>
      <Tooltip content="Make spectator">
        <RemoveIcon onClick={() => onRemoveEditorClicked(id)} />
      </Tooltip>
    </IconContainer>
  );
};
