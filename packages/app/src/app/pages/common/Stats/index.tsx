import { Sandbox } from '@codesandbox/common/lib/types';
import { observer } from 'app/componentConnectors';
import React from 'react';
import EyeIcon from 'react-icons/lib/fa/eye';
import ForkIcon from 'react-icons/lib/go/repo-forked';

import { LikeHeart } from 'app/pages/common/LikeHeart';

import { Stats as StatsWrapper } from './elements';
import { Stat } from './Stat';

interface Props {
  sandbox: Sandbox;
}

const StatsComponent = ({ sandbox }: Props) => (
  <StatsWrapper>
    <Stat Icon={<EyeIcon />} count={sandbox.viewCount} />
    <Stat
      Icon={<LikeHeart sandbox={sandbox} colorless />}
      count={sandbox.likeCount}
    />

    <Stat Icon={<ForkIcon />} count={sandbox.forkCount} />
  </StatsWrapper>
);

export const Stats = observer(StatsComponent);
