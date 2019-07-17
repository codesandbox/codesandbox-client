import Tooltip from '@codesandbox/common/lib/components/Tooltip';
import { observer } from 'mobx-react-lite';
import React from 'react';
import FollowIcon from 'react-icons/lib/io/eye';
import UnFollowIcon from 'react-icons/lib/io/eye-disabled';

import { useSignals, useStore } from 'app/store';

import { IconContainer } from '../elements';
import { User } from '../types';

type Props = {
  userId: User['id'];
};
export const SideView = observer<Props>(({ userId }) => {
  const {
    live: { onFollow },
  } = useSignals();
  const {
    live: { followingUserId, liveUserId },
  } = useStore();

  return (
    userId !== liveUserId && (
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
    )
  );
});
