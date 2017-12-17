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

export default ({ sandbox }) => (
  <Stats>
    <Stat Icon={<EyeIcon />} count={sandbox.viewCount} />
    <Stat
      Icon={<LikeHeart sandbox={sandbox} colorless />}
      count={sandbox.likeCount}
    />
    <Stat Icon={<ForkIcon />} count={sandbox.forkCount} />
  </Stats>
);
