import React, { useRef, useEffect } from 'react';

import { motion } from 'framer-motion';

import { H2, P } from '../../../components/Typography';
import code from '../../../assets/images/code.png';
import bug from '../../../assets/images/bug.png';
import share from '../../../assets/images/share.png';
import code2x from '../../../assets/images/code@2x.png';
import bug2x from '../../../assets/images/bugs@2x.png';
import share2x from '../../../assets/images/share@2x.png';
import Tweet from '../../../components/Tweet';

import { Grid, Section, White, tweetStyle, tweetStyleMobile } from './elements';
import { applyParallax } from '../../../utils/parallax';

const tweet = {
  username: 'brian_d_vaughn',
  job: 'Software Engineer, React Core Team',
  name: 'Brian Vaughn',
  quote:
    "It's dramatically improved my experience of sharing ideas and responding to online questions.",
  url: 'https://twitter.com/brian_d_vaughn/status/987758237104594945?s=20',
};

const Share = () => {
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
        <div ref={parallaxRef}>
          <Tweet style={tweetStyle} tweet={tweet} />
        </div>

        <div>
          <H2>Share with a Click</H2>
          <P
            muted
            big
            css={`
              margin-bottom: 2rem;
            `}
          >
            Every sandbox gets a secure URL, ready to share.
          </P>
          <P muted>
            <White>Share code snippets and creations </White> with friends,
            colleagues, or the world.
          </P>
          <P muted>
            <White>Provide reproducible bug reports</White> when creating GitHub
            issues.
          </P>
          <P muted>
            <White>Ask or answer questions with code</White> on Stack Overflow
            or Twitter.
          </P>
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
          <img src={share} srcSet={`${share} 1x, ${share2x} 2x`} alt="Share" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            duration: 1,
            delay: 0.4,
            ease: 'easeOut',
          }}
        >
          <img src={bug} srcSet={`${bug} 1x, ${bug2x} 2x`} alt="Track Bugs" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            duration: 1,
            delay: 0.3,
            ease: 'easeIn',
          }}
        >
          <img
            src={code}
            srcSet={`${code} 1x, ${code2x} 2x`}
            alt="Speak Code"
          />
        </motion.div>
      </Section>
      <div ref={parallaxRef}>
        <Tweet style={tweetStyleMobile} tweet={tweet} />
      </div>
    </>
  );
};
export default Share;
