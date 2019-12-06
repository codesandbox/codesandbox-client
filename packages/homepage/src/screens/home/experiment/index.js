import React, { useRef, useEffect } from 'react';
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
import { applyParallax } from '../../../utils/parallax';

const tweet = {
  username: 'gethackteam',
  job: 'Snr. Frontend Developer Hackteam',
  name: 'Roy Derks',
  quote:
    'I often use CodeSandbox to create demos or try out new JavaScript features or packages. You can find my profile here',
  url: 'https://twitter.com/gethackteam/status/1173522963162959872',
};

const Experiment = () => {
  const parallaxRef = useRef(null);
  useEffect(() => {
    applyParallax(parallaxRef.current, {
      speed: 1.2,
      center: true,
    });
  }, [parallaxRef]);

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
