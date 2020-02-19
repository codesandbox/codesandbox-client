import React, { FunctionComponent } from 'react';

import { Stat } from 'app/components/Stat';
import { useOvermind } from 'app/overmind';

import { Badges } from './Badges';
import { Container, Stats as StatsWrapper } from './elements';

export const Stats: FunctionComponent = () => {
  const {
    state: {
      profile: {
        current: { forkedCount, receivedLikeCount, viewCount },
      },
    },
  } = useOvermind();

  return (
    <Container>
      <Badges />

      <StatsWrapper>
        <Stat name="Likes" count={receivedLikeCount} />

        <Stat name="Views" count={viewCount} />

        <Stat name="Forked" count={forkedCount} />
      </StatsWrapper>
    </Container>
  );
};
