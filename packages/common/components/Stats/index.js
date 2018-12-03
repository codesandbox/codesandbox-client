import React from 'react';

import EyeIcon from 'react-icons/lib/fa/eye';
import ForkIcon from 'react-icons/lib/go/repo-forked';
import LikeHeart from 'react-icons/lib/go/heart';
import Stat from './Stat';

import { Stats } from './elements';

function StatsComponent({ viewCount, likeCount, forkCount, ...props }) {
  return (
    <Stats {...props}>
      <Stat Icon={<EyeIcon />} count={viewCount} />
      <Stat Icon={<LikeHeart />} count={likeCount} />
      <Stat Icon={<ForkIcon />} count={forkCount} />
    </Stats>
  );
}

export default StatsComponent;
