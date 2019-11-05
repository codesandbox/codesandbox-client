import React, { useState, useRef, useLayoutEffect } from 'react';

import styled from 'styled-components';
import { motion, useViewportScroll, useTransform } from 'framer-motion';
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

const Experiment = ({ src, ...style }) => {
  const [elementTop, setElementTop] = useState(0);
  const ref = useRef(null);
  const { scrollY } = useViewportScroll();

  const y = useTransform(scrollY, [elementTop, elementTop + 1], [0, -0.1], {
    clamp: false,
  });

  useLayoutEffect(() => {
    const element = ref.current;
    setElementTop(element.offsetTop);
  }, [ref]);

  return (
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
            <White>Evaluate npm modules</White> to see what works for your
            project{' '}
          </P>
          <P muted>
            <White>Test out components</White> and create functional examples
          </P>
        </div>

        <Tweet
          style={`
          right: 1rem;
          left: auto;
          width: 25rem;
          margin-top: 1rem;
          position: absolute;
          height: 22rem;
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

      <motion.div style={{ ...style, y }}>
        <Section ref={ref}>
          <img src={frameworks} alt="Frameworks" />
          <img src={npm} alt="NPM Dependencies" />
          <img src={things} alt="Experiment" />
        </Section>
      </motion.div>
    </>
  );
};

export default Experiment;
