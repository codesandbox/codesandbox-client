import React, { useState, useRef, useLayoutEffect } from 'react';

import styled from 'styled-components';
import { motion, useViewportScroll, useTransform } from 'framer-motion';
import { down } from 'styled-breakpoints';
import { P, H3, H5 } from '../../components/Typography';

import started from '../../assets/images/started.png';
import Tweet from '../../components/Tweet';

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 642px;
  grid-gap: 30px;

  ${down('md')} {
    grid-template-columns: 1fr;
  }
`;

const Started = () => {
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
      <Grid css="">
        <div
          css={`
            position: relative;
          `}
        >
          <H3
            css={`
              margin-bottom: 1.5rem;
            `}
          >
            Get started in an instant
          </H3>
          <H5>Start from a template, or GitHub</H5>
          <P muted>React, Vue, Angular, whichever</P>
          <H5>Hot reload and auto-deploy</H5>
          <P muted>Your app is updated as you type</P>
          <H5>Live preview </H5>
          <P muted>See changes as you make them</P>

          <div ref={ref}>
            <motion.div style={{ y }}>
              <Tweet
                style={`
             right: -6rem;
             left: auto;
             width: 30rem;
             margin-top: 10rem;
             min-height: 20rem;
             background: #242424

           `}
                tweet={{
                  name: 'Peggy Rayzis',
                  quote:
                    "I'm obsessed with CodeSandbox's GitHub import feature!! 😍 One click and you can convert a repo to a sandbox that automatically stays up to date with the latest commits.",
                  url:
                    'https://twitter.com/peggyrayzis/status/976557689651236864?s=20',
                  username: 'peggyrayzis',
                  job: 'DX at Apollo',
                }}
              />
            </motion.div>
          </div>
        </div>

        <img src={started} alt="started" />
      </Grid>
    </>
  );
};

export default Started;
