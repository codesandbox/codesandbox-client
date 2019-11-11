import React from 'react';

import styled from 'styled-components';
import { motion, useViewportScroll, useTransform } from 'framer-motion';

import { down } from 'styled-breakpoints';
import { H2, P } from '../../components/Typography';
import code from '../../assets/images/code.png';
import bug from '../../assets/images/bug.png';
import share from '../../assets/images/share.png';
import Tweet from '../../components/Tweet';

const Grid = styled.div`
  display: grid;
  grid-template-columns: 416px 1fr;
  grid-gap: 2.5rem;
  position: relative;

  ${down('md')} {
    grid-template-columns: 1fr;
  }
`;

const Section = styled.section`
  display: grid;
  grid-template-columns: repeat(3, 300px);
  grid-gap: 2rem;
  margin-top: 14.5rem;
  position: relative;
  z-index: 2;
  margin-left: 200px;

  ${down('md')} {
    grid-template-columns: 1fr;
    margin-left: 0px;
    margin-top: 30rem;
    justify-items: center;
  }
`;

const White = styled.span`
  color: ${props => props.theme.homepage.white};
`;

const Share = () => {
  const { scrollY } = useViewportScroll();
  const y = useTransform(scrollY, [0, -100], [0, 5], { clamp: false });

  return (
    <>
      <Grid>
        <div>
          <Tweet
            style={`
          right: auto;
          left: auto;
          width: 416px;
          margin-top: 0rem;
          height: 22rem;
          position: absolute;
          background:#151515;
        `}
            tweet={{
              username: 'brian_d_vaughn',
              job: 'Software Engineer, React Core Team',
              name: 'Brian Vaughn',
              quote:
                "It's dramatically improved my experience of sharing ideas and responding to online questions",
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
            Every sandbox gets a secure URL, ready to share
          </P>
          <P muted>
            <White>Share code snippets and creations </White> with friends,
            colleagues, the world
          </P>
          <P muted>
            <White>Provide reproducible bug reports</White> when creating GitHub
            issues
          </P>
          <P muted>
            <White>Ask or answer questions with code</White> on Stack Overflow
            or Twitter
          </P>
        </div>
      </Grid>

      <motion.div style={{ y }}>
        <Section>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{
              duration: 1,
              ease: 'easeOut',
            }}
          >
            <img src={share} alt="Share" />
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
            <img src={code} alt="Speak Code" />
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
            <img src={bug} alt="Track Bugs" />
          </motion.div>
        </Section>
      </motion.div>
    </>
  );
};
export default Share;
