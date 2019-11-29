import React, { useRef, useEffect } from 'react';
import Rellax from 'rellax';
import styled from 'styled-components';
import { motion } from 'framer-motion';
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
  margin-top: 5rem;

  ${props => props.theme.breakpoints.lg} {
    grid-template-columns: 1fr 1fr;
  }

  ${props => props.theme.breakpoints.md} {
    grid-template-columns: 1fr;
  }
`;

const Section = styled.section`
  display: grid;
  grid-template-columns: repeat(3, 300px);
  grid-gap: 2rem;
  margin-top: 5rem;
  position: relative;
  z-index: 2;

  ${props => props.theme.breakpoints.lg} {
    grid-template-columns: repeat(3, 1fr);
  }

  ${props => props.theme.breakpoints.md} {
    grid-template-columns: repeat(3, 1fr);
    grid-gap: 1rem;

    img {
      max-width: 100%;
    }
  }
`;

const White = styled.span`
  color: white;
`;

const tweetStyle = `
  right: 1rem;
  left: auto;
  width: 25rem;
  margin-top: 1rem;
  height: 22rem;
  background: #151515
`;

const Experiment = () => {
  const parallaxRef = useRef(null);
  useEffect(() => {
    // eslint-disable-next-line no-new
    new Rellax(parallaxRef.current, {
      speed: 1,
      center: true,
    });
  }, []);
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
            Try things out to see how they work in reality.
          </P>
          <P muted>
            <White>Learn new frameworks</White> and test your understanding.{' '}
          </P>
          <P muted>
            <White>Evaluate npm modules</White> to see what works for your
            project.{' '}
          </P>
          <P muted>
            <White>Test out components</White> by creating functional examples.
          </P>
        </div>
        <div ref={parallaxRef}>
          <Tweet
            style={tweetStyle}
            tweet={{
              username: 'gethackteam',
              job: 'Snr. Frontend Developer, Hackteam',
              name: 'Roy Derks',
              quote:
                'I often use CodeSandbox to create demos or try out new JavaScript features or packages.',
              url:
                'https://twitter.com/gethackteam/status/1173522963162959872?s=20',
            }}
          />
        </div>
      </Grid>

      <Section>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            duration: 1,
            ease: 'easeOut',
          }}
        >
          <img src={frameworks} alt="Frameworks" />
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            duration: 1,
            ease: 'easeOut',
          }}
        >
          <img src={npm} alt="NPM Dependencies" />
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            duration: 1,
            ease: 'easeOut',
          }}
        >
          <img src={things} alt="Experiment" />
        </motion.div>
      </Section>
    </>
  );
};

export default Experiment;
