import { LiveUser } from '@codesandbox/common/lib/types';
import React, { FunctionComponent } from 'react';
import AddIcon from 'react-icons/lib/md/add';

import { useOvermind } from 'app/overmind';

import { Button } from './Button';

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
    <Button
      Icon={() => <AddIcon onClick={() => onAddEditorClicked(id)} />}
      isSecond
      tooltip="Make editor"
    />
  );
};
