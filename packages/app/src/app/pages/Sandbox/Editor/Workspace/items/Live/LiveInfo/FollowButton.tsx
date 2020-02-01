import Tooltip from '@codesandbox/common/lib/components/Tooltip';
import { LiveUser } from '@codesandbox/common/lib/types';
import React, { FunctionComponent } from 'react';
import UnFollowIcon from 'react-icons/lib/io/eye-disabled';
import FollowIcon from 'react-icons/lib/io/eye';

import { useOvermind } from 'app/overmind';

import { IconContainer } from './elements';

type Props = {
  user: LiveUser;
};
export const FollowButton: FunctionComponent<Props> = ({ user: { id } }) => {
  const {
    actions: {
      live: { onFollow },
    },
    state: {
      live: { followingUserId, liveUserId },
    },
  } = useOvermind();

  if (id === liveUserId) {
    return null;
  }

  return (
    <IconContainer>
      {followingUserId === id ? (
        <Tooltip content="Stop following">
          <UnFollowIcon onClick={() => onFollow(null)} />
        </Tooltip>
      ) : (
        <Tooltip content="Follow along">
          <FollowIcon onClick={() => onFollow(id)} />
        </Tooltip>
      )}
    </IconContainer>
  );
};
