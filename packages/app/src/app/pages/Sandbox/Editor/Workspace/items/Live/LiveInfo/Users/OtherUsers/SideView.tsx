import Tooltip from '@codesandbox/common/lib/components/Tooltip';
import { observer } from 'mobx-react-lite';
import React from 'react';
import FollowIcon from 'react-icons/lib/io/eye';
import UnFollowIcon from 'react-icons/lib/io/eye-disabled';
import AddIcon from 'react-icons/lib/md/add';

import { useSignals, useStore } from 'app/store';

import { IconContainer } from '../elements';

export const SideView = observer(({ userId }) => {
  const {
    live: { onAddEditorClicked, onFollow },
  } = useSignals();
  const {
    live: {
      followingUserId,
      isOwner,
      liveUserId,
      roomInfo: { mode },
    },
  } = useStore();

  return (
    <>
      {mode !== 'classroom' && userId !== liveUserId && (
        <IconContainer>
          {followingUserId === userId ? (
            <Tooltip content="Stop following">
              <UnFollowIcon onClick={() => onFollow({ liveUserId: null })} />
            </Tooltip>
          ) : (
            <Tooltip content="Follow along">
              <FollowIcon onClick={() => onFollow({ liveUserId: userId })} />
            </Tooltip>
          )}
        </IconContainer>
      )}

      {isOwner && mode === 'classroom' && (
        <IconContainer style={{ marginLeft: '0.25rem' }}>
          <Tooltip content={'Make editor'}>
            <AddIcon
              onClick={() => onAddEditorClicked({ liveUserId: userId })}
            />
          </Tooltip>
        </IconContainer>
      )}
    </>
  );
});
