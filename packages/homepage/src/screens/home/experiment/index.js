import React, { useRef, useEffect } from 'react';
import Rellax from 'rellax';
import { motion } from 'framer-motion';
import { H2, P } from '../../../components/Typography';

import frameworks from '../../../assets/images/frameworks.png';
import frameworks2x from '../../../assets/images/frameworks@2x.png';
import things from '../../../assets/images/things.png';
import things2x from '../../../assets/images/things@2x.png';
import npm from '../../../assets/images/npm.png';
import npm2x from '../../../assets/images/npm@2x.png';
import Tweet from '../../../components/Tweet';
import { Grid, Section, White, tweetStyle, tweetStyleMobile } from './elements';

const tweet = {
  username: 'dan_abramov',
  job: 'Software Engineer, React Core Team',
  name: 'Dan Abramov',
  quote: 'CodeSandbox is cool. Lets you add npm dependencies.',
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
            big
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
      <div ref={parallaxRef}>
        <Tweet style={tweetStyleMobile} tweet={tweet} />
      </div>
    </>
  );
};

export default Experiment;
