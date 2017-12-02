import React from 'react';
import styled from 'styled-components';

import EyeIcon from 'react-icons/lib/fa/eye';
import ForkIcon from 'react-icons/lib/go/repo-forked';

import Stat from './Stat';
import LikeHeart from '../../../containers/LikeHeart/index';

const Stats = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: row;
  height: 100%;
`;

type Props = {
  viewCount: number,
  forkCount: number,
  likeCount: number,
  sandboxId: string,
};

export default ({ viewCount, forkCount, likeCount, sandboxId }: Props) => (
  <Stats>
    <Stat Icon={<EyeIcon />} count={viewCount} />
    <Stat
      Icon={<LikeHeart colorless sandboxId={sandboxId} />}
      count={likeCount}
    />
    <Stat Icon={<ForkIcon />} count={forkCount} />
  </Stats>
);
