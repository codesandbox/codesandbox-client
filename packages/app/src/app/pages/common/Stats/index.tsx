import { Sandbox } from '@codesandbox/common/lib/types';
import { useAppState } from 'app/overmind';
import { LikeHeart } from 'app/pages/common/LikeHeart';
import React from 'react';

import { Stats as StatsWrapper } from './elements';
import { EyeIcon } from './EyeIcon';
import { ForkIcon } from './ForkIcon';
import { Stat } from './Stat';

interface Props {
  sandbox: Sandbox;
}

const StatsComponent: React.FC<Props> = ({ sandbox }) => {
  // We want to observe the sandbox
  useAppState();

  return (
    <StatsWrapper>
      <Stat
        Icon={<LikeHeart sandbox={sandbox} colorless />}
        count={sandbox.likeCount}
      />

      <Stat Icon={<EyeIcon />} count={sandbox.viewCount} />

      <Stat Icon={<ForkIcon />} count={sandbox.forkCount} />
    </StatsWrapper>
  );
};

export const Stats = StatsComponent;
