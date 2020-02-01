import Tooltip from '@codesandbox/common/lib/components/Tooltip';
import { LiveUser } from '@codesandbox/common/lib/types';
import React, { FunctionComponent } from 'react';
import AddIcon from 'react-icons/lib/md/add';

import { useOvermind } from 'app/overmind';

import { IconContainer } from './elements';

type Props = {
  user: LiveUser;
};
export const MakeEditorButton: FunctionComponent<Props> = ({
  user: { id },
}) => {
  const {
    actions: {
      live: { onAddEditorClicked },
    },
  } = useOvermind();

  return (
    <IconContainer>
      <Tooltip content="Make editor">
        <AddIcon onClick={() => onAddEditorClicked(id)} />
      </Tooltip>
    </IconContainer>
  );
};
