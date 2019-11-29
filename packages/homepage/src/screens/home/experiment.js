import React, { useRef, useEffect } from 'react';
import Rellax from 'rellax';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { H2, P } from '../../components/Typography';

import frameworks from '../../assets/images/frameworks.png';
import frameworks2x from '../../assets/images/frameworks@2x.png';
import things from '../../assets/images/things.png';
import things2x from '../../assets/images/things@2x.png';
import npm from '../../assets/images/npm.png';
import npm2x from '../../assets/images/npm@2x.png';
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
    margin-top: 2.5rem;

    img {
      max-width: 100%;
    }
  }
`;

const White = styled.span`
  color: white;
`;

const shared = `
  right: 1rem;
  left: auto;
  width: 25rem;
  margin-top: 1rem;
  height: 22rem;
  background: #151515;
`;

const tweetStyle = `
  ${shared}
  ${props => props.theme.breakpoints.md} {
    display: none;
  }
`;

const tweetStyleMobile = `
  ${shared}
  display: none;
  margin-top: 3.5rem !important;
  ${props => props.theme.breakpoints.md} {
    display: block;
  }
`;

const tweet = {
  username: 'dan_abramov',
  job: 'Software Engineer, React Core Team',
  name: 'Dan Abramov',
  quote: 'Wow, https://codesandbox.io/ is cool. Lets you add npm dependencies.',
  url: 'https://twitter.com/dan_abramov/status/852555473551273984',
};

const Experiment = () => {
  const parallaxRef = useRef(null);
  useEffect(() => {
    // eslint-disable-next-line no-new
    new Rellax(parallaxRef.current, {
      speed: 1.2,
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
          <Tweet style={tweetStyle} tweet={tweet} />
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
          <img
            src={frameworks}
            srcSet={`${frameworks} 1x, ${frameworks2x} 2x`}
            alt="Frameworks"
          />
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            duration: 1,
            ease: 'easeOut',
          }}
        >
          <img
            src={npm}
            srcSet={`${npm} 1x, ${npm2x} 2x`}
            alt="NPM Dependencies"
          />
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            duration: 1,
            ease: 'easeOut',
          }}
        >
          <img
            src={things}
            srcSet={`${things} 1x, ${things2x} 2x`}
            alt="Frameworks"
          />
        </motion.div>
      </Section>
      <Tweet style={tweetStyleMobile} tweet={tweet} />
    </>
  );
};

export default Experiment;
