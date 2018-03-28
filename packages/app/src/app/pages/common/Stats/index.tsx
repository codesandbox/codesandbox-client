import * as React from 'react';
import { observer } from 'mobx-react';

import EyeIcon from 'react-icons/lib/fa/eye';
import ForkIcon from 'react-icons/lib/go/repo-forked';
import LikeHeart from 'app/pages/common/LikeHeart';
import Stat from './Stat';

import { Sandbox } from 'app/store/modules/editor/types'

import { Stats } from './elements';

type Props = {
  sandbox: Sandbox
}

const StatsComponent: React.SFC<Props> = ({ sandbox }) => {
  return (
    <Stats>
      <Stat Icon={<EyeIcon />} count={sandbox.viewCount} />
      <Stat
        Icon={<LikeHeart sandbox={sandbox} colorless />}
        count={sandbox.likeCount}
      />
      <Stat Icon={<ForkIcon />} count={sandbox.forkCount} />
    </Stats>
  );
}

export default observer(StatsComponent);
