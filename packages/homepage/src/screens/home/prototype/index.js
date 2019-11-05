import React, { useState, useRef, useLayoutEffect, useEffect } from 'react';
import { useInView } from 'react-hook-inview';

import styled from 'styled-components';
import { motion, useViewportScroll, useTransform } from 'framer-motion';
import { TimelineLite } from 'gsap/TweenMax';
import { H2, P, H3, H5 } from '../../../components/Typography';

import Tweet from '../../../components/Tweet';

import Stars from './stars.svg';
import IDE from './ide.svg';

const Grid = styled.div`
  display: grid;
  grid-template-columns: 642px 1fr;
  grid-gap: 32px;
  margin-bottom: 14rem;
  margin-top: 4rem;
`;

const ImageWrapper = styled.div`
  background: #151515;
  border-radius: 4px;
  min-height: 475px;
  position: relative;
`;

const Prototype = () => {
  const [elementTop, setElementTop] = useState(0);
  const [inViewRef, inView] = useInView();
  const ref = useRef(null);
  const { scrollY } = useViewportScroll();
  const stars = useRef(null);
  const ideRef = useRef(null);
  const animation = new TimelineLite();

  const y = useTransform(scrollY, [elementTop, elementTop + 1], [0, -0.1], {
    clamp: false,
  });
  useLayoutEffect(() => {
    const element = ref.current;
    setElementTop(element.offsetTop);
  }, [ref]);

  useEffect(() => {
    animation
      .to(stars.current, 1, { scale: 2, delay: 2 })
      .to(ideRef.current, 1.5, { y: -400, opacity: 1, delay: 1 })
      .to(stars.current, 1, { scale: 1, y: 70, x: 60 }, '-=1');
    if (inView) animation.resume();
  }, [animation, inView]);

  return (
    <>
      <H2>Prototype Quickly</H2>
      <P muted>Test your ideas early and often</P>
      <Grid css="">
        <ImageWrapper ref={inViewRef}>
          <div
            css={`
              position: absolute;
              left: 50%;
              top: 50%;
              margin-top: -60px;
              margin-left: -121px;
              z-index: 2;
              transform: scale(0.01);
            `}
            ref={stars}
          >
            <Stars />
          </div>
          <div
            ref={ideRef}
            css={`
              opacity: 0;
              position: absolute;
              top: 100%;
            `}
          >
            <IDE />
          </div>
        </ImageWrapper>
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
            Code from anywhere
          </H3>
          <H5>On any device </H5>
          <P muted>You just need a web browser</P>
          <H5>With no setup</H5>
          <P muted>Go straight to coding</P>
          <H5>VS Code built-in </H5>
          <P muted>The editor’s full-featured, yet familiar</P>

          <motion.div style={{ y }}>
            <div ref={ref}>
              <Tweet
                style={`
              background: #242424
              `}
                tweet={{
                  name: 'Jonnie Hallman',
                  username: 'destroytoday',
                  job: 'Designer Developer, Stripe',
                  quote: 'it feels much more like my local environment',
                  url:
                    'https://twitter.com/destroytoday/status/1173805935384350720',
                }}
              />
            </div>
          </motion.div>
        </div>
      </Grid>
    </>
  );
};

export default Prototype;
