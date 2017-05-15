import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { sandboxUrl } from 'app/utils/url-generator';
import delayEffect from 'app/utils/animation/delay-effect';
import Row from 'app/components/flex/Row';

import Stat from 'app/components/Stat';
import LikeHeart from 'app/containers/LikeHeart';
import PlayButton from './PlayButton';

const Container = styled.div`
  background-color: #272C2E;
  box-shadow: 0 3px 3px rgba(0, 0, 0, 0.3);
  box-sizing: border-box;
  padding: 1.5rem;

  display: flex;
  flex-direction: column;

  margin-bottom: 2rem;

  ${delayEffect(0.35)}
`;

const Title = styled.h1`
  font-weight: 400;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-size: 1.25rem;
  font-weight: 300;
  z-index: 2;
`;

const Like = styled(LikeHeart)`
  margin-left: 0.5rem;
  transform: translateY(-3px);
`;

const Description = styled.p`
  font-weight: 300;
  font-size: 1rem;
  margin-right: 3rem;
  color: rgba(255, 255, 255, 0.8);
`;

const Stats = styled.div`
  position: relative;
  display: flex;
  width: 100%;
  justify-content: space-around;
  z-index: 1;
  flex: 4;
`;

const PlayButtonContainer = styled(Link)`
  position: absolute;
  display: flex;
  justify-content: center;
  top: -160%;
  left: 0;
  right: 0;

  cursor: pointer;

  ${delayEffect(0.5)}
`;

type Props = {
  id: string,
  title: string,
  description: string,
  likeCount: number,
  viewCount: number,
  forkCount: number,
};

export default ({
  id,
  title,
  description,
  likeCount,
  viewCount,
  forkCount,
}: Props) => (
  <Container>
    <Row alignItems="center">
      <Title>{title} <Like sandboxId={id} /></Title>
    </Row>
    <Row alignItems="flex-start">
      <div style={{ flex: 6 }}>
        <Description>
          {description}
        </Description>
      </div>
      <Stats>
        <PlayButtonContainer to={sandboxUrl({ id })}>
          <PlayButton />
        </PlayButtonContainer>
        <Stat name="likes" count={likeCount} />
        <Stat name="views" count={viewCount} />
        <Stat name="forks" count={forkCount} />
      </Stats>
    </Row>
  </Container>
);
