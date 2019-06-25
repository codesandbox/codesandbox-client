import Margin from '@codesandbox/common/lib/components/spacing/Margin';
import Tooltip from '@codesandbox/common/lib/components/Tooltip';
import React from 'react';
import FollowIcon from 'react-icons/lib/io/eye';
import UnFollowIcon from 'react-icons/lib/io/eye-disabled';
import AddIcon from 'react-icons/lib/md/add';

import { useSignals, useStore } from 'app/store';

import { SubTitle } from '../../elements';

import { IconContainer, NoUsers, Users } from '../elements';
import { User } from '../User';

export const OtherUsers = ({ otherUsers }) => {
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
  const getSideView = userId => (
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

  return (
    <Margin top={1}>
      <SubTitle>Users</SubTitle>

      <Users>
        {otherUsers.length ? (
          otherUsers.map(user => (
            <User
              key={user.id}
              sideView={getSideView(user.id)}
              type="Spectator"
              user={user}
            />
          ))
        ) : (
          <NoUsers>No other users in session, invite them!</NoUsers>
        )}
      </Users>
    </Margin>
  );
};
