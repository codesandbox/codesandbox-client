import React from 'react';
import styled from 'styled-components';
import { H2, P } from '../../components/Typography';

import frameworks from '../../assets/images/frameworks.png';
import things from '../../assets/images/things.png';
import npm from '../../assets/images/npm.png';
import Tweet from '../../components/Tweet';

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 304px;
  grid-gap: 2rem;
  position: relative;
  margin-top: 15rem;
`;

const Section = styled.section`
  display: grid;
  grid-template-columns: repeat(3, 300px);
  grid-gap: 2rem;
  margin-top: 6.5rem;
  position: relative;
  z-index: 2;
`;

const White = styled.span`
  color: white;
`;

const Experiment = () => (
  <>
    <Grid>
      <div>
        <H2>Experiment Easily</H2>
        <P
          muted
          css={`
            margin-bottom: 2rem;
          `}
        >
          Try things out to see how they work in reality
        </P>
        <P muted>
          <White>Learn new frameworks</White> and test your understanding{' '}
        </P>
        <P muted>
          <White>Evaluate npm modules</White> to see what works for your project{' '}
        </P>
        <P muted>
          <White>Test out components</White> and create functional examples
        </P>
      </div>
      <Tweet
        style={`
          right: -112px;
          left: auto;
          width: 416px;
          margin-top: 0;
          position: absolute;
          height: 440px;
          background: #151515
        `}
        tweet={{
          username: 'gethackteam',
          job: 'Frontend Dev,eloper Hackteam',
          name: 'Roy Derks',
          quote:
            'I often use CodeSandbox to create demos or try out new JavaScript features or packages',
          url:
            'https://twitter.com/gethackteam/status/1173522963162959872?s=20',
        }}
      />
    </Grid>
    <Section>
      <img src={frameworks} alt="Frameworks" />
      <img src={npm} alt="NPM Dependencies" />
      <img src={things} alt="Experiment" />
    </Section>
  </>
);

export default Experiment;
