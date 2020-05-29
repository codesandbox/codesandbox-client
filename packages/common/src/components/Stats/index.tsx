import React from 'react';
import { FaEye } from 'react-icons/fa';
import { GoHeart, GoRepoForked } from 'react-icons/go';

import { Stats } from './elements';
import Stat from './Stat';

type StatsComponentProps = {
  viewCount: number;
  likeCount: number;
  forkCount: number;
  vertical?: boolean;
  text?: boolean;
  style?: React.CSSProperties;
};

function StatsComponent({
  viewCount,
  likeCount,
  forkCount,
  vertical = false,
  text = false,
  style,
  ...props
}: StatsComponentProps) {
  return (
    <Stats vertical={vertical} {...props}>
      <Stat
        text={text ? 'views' : undefined}
        textOne={text ? 'view' : undefined}
        vertical={vertical}
        Icon={<FaEye />}
        count={viewCount}
      />
      <Stat
        text={text ? 'likes' : undefined}
        textOne={text ? 'like' : undefined}
        vertical={vertical}
        Icon={<GoHeart />}
        count={likeCount}
      />
      <Stat
        text={text ? 'forks' : undefined}
        textOne={text ? 'fork' : undefined}
        vertical={vertical}
        Icon={<GoRepoForked />}
        count={forkCount}
      />
    </Stats>
  );
}

export default StatsComponent;
