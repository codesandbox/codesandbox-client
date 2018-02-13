import React from 'react';

import Stat from 'app/components/Stat';

import Badges from './Badges';
import { Container, Stats } from './elements';

function StatsComponent({ viewCount, likeCount, forkCount, badges }) {
  return (
    <Container>
      <Badges badges={badges} />

      <Stats>
        <Stat name="Likes" count={likeCount} />
        <Stat name="Views" count={viewCount} />
        <Stat name="Forked" count={forkCount} />
      </Stats>
    </Container>
  );
}

export default StatsComponent;
