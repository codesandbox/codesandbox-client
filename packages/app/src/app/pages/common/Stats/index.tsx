import * as React from 'react';
import { observer } from 'mobx-react';

import EyeIcon from 'react-icons/lib/fa/eye';
import ForkIcon from 'react-icons/lib/go/repo-forked';
import LikeHeart from 'app/pages/common/LikeHeart';
import { Sandbox } from 'app/store/modules/editor/types';

import Stat from './Stat';
import { Stats } from './elements';

export type Props = {
  sandbox: Sandbox;
};

const StatsComponent: React.SFC<Props> = ({ sandbox }) => (
  <Stats>
    <Stat Icon={<EyeIcon />} count={sandbox.viewCount} />
    <Stat
      Icon={<LikeHeart sandbox={sandbox} colorless />}
      count={sandbox.likeCount}
    />
    <Stat Icon={<ForkIcon />} count={sandbox.forkCount} />
  </Stats>
);

export default observer(StatsComponent);
