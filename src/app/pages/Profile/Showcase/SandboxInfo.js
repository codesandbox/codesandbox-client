import React from 'react';
import styled from 'styled-components';
import delayEffect from '../../../utils/animation/delay-effect';
import Row from '../../../components/flex/Row';

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
  // background-image: linear-gradient(-45deg, #74BFF3 0%, #108EE7 100%);
  // box-shadow: 0 0 15px rgba(0, 0, 0, 0.5);
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-size: 1.25rem;
  font-weight: 300;
  z-index: 2;
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

const PlayButtonContainer = styled.div`
  position: absolute;
  display: flex;
  justify-content: center;
  top: -145%;
  left: 0;
  right: 0;

  cursor: pointer;

  ${delayEffect(0.5)}
`;

const Stat = styled.div`
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  padding: 0;
  margin: 1rem 0;
  flex: 1;
  border-right: 1px solid rgba(255, 255, 255, 0.15);

  &:last-child {
    border-right: none;
  }
`;

const Number = styled.div`
  font-weight: 400;
  font-size: 1.125rem;
`;

const Property = styled.div`
  font-weight: 400;
  font-size: .875rem;
  color: rgba(255, 255, 255, 0.5);
  text-transform: uppercase;
  margin-bottom: 0.4rem;
`;

type Props = {
  title: string,
};

export default ({ title }: Props) => (
  <Container>
    <Title>{title}</Title>
    <Row>
      <div style={{ flex: 6 }}>
        <Description>
          An example of React Router copied from https://reacttraining.com/react-router/web/guides/quick-start.
        </Description>
      </div>
      <Stats>
        <PlayButtonContainer>
          <PlayButton />
        </PlayButtonContainer>
        <Stat>
          <Property>loves</Property>
          <Number>10</Number>
        </Stat>
        <Stat>
          <Property>views</Property>
          <Number>10.219</Number>
        </Stat>
        <Stat>
          <Property>forks</Property>
          <Number>52</Number>
        </Stat>
      </Stats>
    </Row>
  </Container>
);
