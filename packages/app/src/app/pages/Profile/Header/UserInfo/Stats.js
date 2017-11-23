import React from 'react';
import styled from 'styled-components';
import type { Badge as BadgeT } from 'common/types';
import { Link } from 'react-router-dom';

import Stat from 'app/components/Stat';
import Margin from 'common/components/spacing/Margin';
import Badge from 'common/utils/badges/Badge';
import delayEffect from 'common/utils/animation/delay-effect';
import { patronUrl } from 'common/utils/url-generator';

const Container = styled.div`
  float: right;
  flex: 1;
  display: flex;
  height: 100%;
  max-width: 450px;
  margin-bottom: 4rem;
  align-items: center;

  ${delayEffect(0.1)};
`;

const Stats = styled.div`
  flex: 1;
  display: flex;
  height: 100%;

  justify-content: center;
  align-items: top;
  font-size: 1.25rem;
`;

type Props = {
  viewCount: number,
  likeCount: number,
  forkCount: number,
  badges: Array<BadgeT>,
};

const Badges = ({
  badges,
}: {
  badges: Array<{ id: string, name: string }>,
}) => (
  <Margin right={2}>
    <Link to={patronUrl()}>
      {badges.map(badge => <Badge key={badge.id} badge={badge} size={64} />)}
    </Link>
  </Margin>
);

export default ({ viewCount, likeCount, forkCount, badges }: Props) => (
  <Container>
    <Badges badges={badges} />

    <Stats>
      <Stat name="Likes" count={likeCount} />
      <Stat name="Views" count={viewCount} />
      <Stat name="Forked" count={forkCount} />
    </Stats>
  </Container>
);
