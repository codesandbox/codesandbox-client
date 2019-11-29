import React, { useRef, useEffect } from 'react';
import Rellax from 'rellax';
import styled from 'styled-components';
import { motion } from 'framer-motion';

import { H2, P } from '../../components/Typography';
import code from '../../assets/images/code.png';
import bug from '../../assets/images/bug.png';
import share from '../../assets/images/share.png';
import code2x from '../../assets/images/code@2x.png';
import bug2x from '../../assets/images/bugs@2x.png';
import share2x from '../../assets/images/share@2x.png';
import Tweet from '../../components/Tweet';

const Grid = styled.div`
  display: grid;
  grid-template-columns: 416px 1fr;
  grid-gap: 2.5rem;
  position: relative;

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
  margin-left: 200px;

  ${props => props.theme.breakpoints.lg} {
    margin-left: 0px;
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
  color: ${props => props.theme.homepage.white};
`;

const Share = () => {
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
        <div ref={parallaxRef}>
          <Tweet
            style={`
              right: auto;
              left: auto;
              width: 416px;
              margin-top: 0rem;
              height: 22rem;
              position: absolute;
              background: #151515;
        `}
            tweet={{
              username: 'brian_d_vaughn',
              job: 'Software Engineer, React Core Team',
              name: 'Brian Vaughn',
              quote:
                "It's dramatically improved my experience of sharing ideas and responding to online questions.",
              url:
                'https://twitter.com/brian_d_vaughn/status/987758237104594945?s=20',
            }}
          />
        </div>

        <div>
          <H2>Share with a Click</H2>
          <P
            muted
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
          {' '}
          <img
            src={code}
            srcSet={`${code} 1x, ${code2x} 2x`}
            alt="Speak Code"
          />
        </motion.div>
      </Section>
    </>
  );
};
export default Share;
