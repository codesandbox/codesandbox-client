import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  margin-right: 2rem;
  background-color: #272C2E;
  box-shadow: 0 3px 3px rgba(0, 0, 0, 0.3);

  box-sizing: border-box;
`;

const Title = styled.h1`
  font-weight: 300;
  padding: 1rem;
  background-image: linear-gradient(-45deg, #108EE7 0%, #74BFF3 100%);
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.5);
  margin: 0;
  box-sizing: border-box;
  font-size: 1.25rem;
  margin-bottom: 1rem;
  z-index: 2;
`;

const Description = styled.p`
  font-weight: 400;
  margin-top: 0;
  font-size: 1rem;
  padding: 1rem;
  margin-bottom: 1rem;
  color: rgba(255, 255, 255, 0.8);
`;

const Stats = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
  margin-bottom: .5rem;
  z-index: 1;
`;

const Stat = styled.div`
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  padding: 1rem 1.5rem;
  flex: 1;
  border-right: 1px solid rgba(0,0,0,0.2);
`;

const Number = styled.div`
  font-weight: 400;
  font-size: 1.125rem;
  margin-bottom: 0.25rem;
`;

const Property = styled.div`
  font-weight: 300;
  color: rgba(255, 255, 255, 0.7);
`;

type Props = {
  title: string,
};

export default ({ title }: Props) => (
  <Container>
    <Title>{title}</Title>
    <Stats>
      <Stat>
        <Number>10</Number>
        <Property>favorites</Property>
      </Stat>
      <Stat>
        <Number>10.219</Number>
        <Property>views</Property>
      </Stat>
      <Stat>
        <Number>52</Number>
        <Property>forks</Property>
      </Stat>
    </Stats>
    <Description>
      An example of React Router copied from https://reacttraining.com/react-router/web/guides/quick-start.
    </Description>
  </Container>
);
