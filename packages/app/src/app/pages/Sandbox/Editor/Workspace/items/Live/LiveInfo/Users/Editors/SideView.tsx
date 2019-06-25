import Tooltip from '@codesandbox/common/lib/components/Tooltip';
import React from 'react';
import FollowIcon from 'react-icons/lib/io/eye';
import UnFollowIcon from 'react-icons/lib/io/eye-disabled';
import RemoveIcon from 'react-icons/lib/md/remove';

import { useSignals, useStore } from 'app/store';

import { IconContainer } from '../elements';

export const SideView = ({ userId }) => {
  const {
    live: { onFollow, onRemoveEditorClicked },
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
      {userId !== liveUserId && (
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
          <Tooltip content={'Make spectator'}>
            <RemoveIcon
              onClick={() => onRemoveEditorClicked({ liveUserId: userId })}
            />
          </Tooltip>
        </IconContainer>
      )}
    </>
  );
};
