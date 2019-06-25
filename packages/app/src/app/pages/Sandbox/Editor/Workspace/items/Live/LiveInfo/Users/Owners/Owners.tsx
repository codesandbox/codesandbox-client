import Margin from '@codesandbox/common/lib/components/spacing/Margin';
import Tooltip from '@codesandbox/common/lib/components/Tooltip';
import React from 'react';
import FollowIcon from 'react-icons/lib/io/eye';
import UnFollowIcon from 'react-icons/lib/io/eye-disabled';

import { useSignals, useStore } from 'app/store';

import { SubTitle } from '../../elements';

import { IconContainer, Users } from '../elements';
import { User } from '../User';

type Props = {
  owners: { id: number }[];
};
export const Owners = ({ owners }: Props) => {
  const {
    live: { onFollow },
  } = useSignals();
  const {
    live: { followingUserId, liveUserId },
  } = useStore();
  const getSideView = ownerId =>
    ownerId !== liveUserId && (
      <IconContainer>
        {followingUserId === ownerId ? (
          <Tooltip content="Stop following">
            <UnFollowIcon onClick={() => onFollow({ liveUserId: null })} />
          </Tooltip>
        ) : (
          <Tooltip content="Follow along">
            <FollowIcon onClick={() => onFollow({ liveUserId: ownerId })} />
          </Tooltip>
        )}
      </IconContainer>
    );

  return (
    <Margin top={1}>
      <SubTitle>Owners</SubTitle>

      <Users>
        {owners.map(owner => (
          <User
            key={owner.id}
            sideView={getSideView(owner.id)}
            type="Owner"
            user={owner}
          />
        ))}
      </Users>
    </Margin>
  );
};
