import { LiveUser } from '@codesandbox/common/lib/types';
import React, { FunctionComponent } from 'react';
import UnFollowIcon from 'react-icons/lib/io/eye-disabled';
import FollowIcon from 'react-icons/lib/io/eye';

import { useOvermind } from 'app/overmind';

import { Button } from './Button';

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

  const buttonProps =
    followingUserId === id
      ? {
          Icon: () => <UnFollowIcon onClick={() => onFollow(null)} />,
          tooltip: 'Stop following',
        }
      : {
          Icon: () => <FollowIcon onClick={() => onFollow(id)} />,
          tooltip: 'Follow along',
        };
  return <Button {...buttonProps} />;
};
