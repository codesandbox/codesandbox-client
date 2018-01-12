import React from 'react';

import Fullscreen from 'common/components/flex/Fullscreen';
import Title from 'app/components/Title';
import SubTitle from 'app/components/SubTitle';
import Centered from 'common/components/flex/Centered';

import { Header } from './elements';

function Skeleton() {
  return (
    <Fullscreen>
      <Header />
      <Centered horizontal vertical>
        <Title delay={0.6}>Loading Sandbox...</Title>
        <SubTitle delay={1}>Fetching git repository...</SubTitle>
      </Centered>
    </Fullscreen>
  );
}

export default Skeleton;
