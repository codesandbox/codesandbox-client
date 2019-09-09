import React from 'react';
import { Stat } from 'app/components/Stat';
import Badges from './Badges';
import { Container, Stats as StatsWrapper } from './elements';

export function Stats({ viewCount, likeCount, forkCount, username, badges }) {
  return (
    <Container>
      <Badges username={username} badges={badges} />

      <StatsWrapper>
        <Stat name="Likes" count={likeCount} />
        <Stat name="Views" count={viewCount} />
        <Stat name="Forked" count={forkCount} />
      </StatsWrapper>
    </Container>
  );
}
