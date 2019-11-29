import React, { useRef, useEffect } from 'react';
import { useInView } from 'react-hook-inview';
import Rellax from 'rellax';

import styled from 'styled-components';
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

  ${props => props.theme.breakpoints.lg} {
    grid-template-columns: 1fr;
  }
`;

const ImageWrapper = styled.div`
  background: #151515;
  border-radius: 4px;
  min-height: 475px;
  position: relative;
  overflow: hidden;

  ${props => props.theme.breakpoints.lg} {
    display: none;
  }
`;

const Prototype = () => {
  const [inViewRef, inView] = useInView();
  const parallaxRef = useRef(null);
  const stars = useRef(null);
  const ideRef = useRef(null);
  const animation = new TimelineLite();

  useEffect(() => {
    // eslint-disable-next-line no-new
    new Rellax(parallaxRef.current, {
      speed: 1.2,
      center: true,
    });
  }, []);

  useEffect(() => {
    animation
      .to(stars.current, 1, { scale: 2, delay: 1 })
      .to(ideRef.current, 1.5, {
        y: -400,
        opacity: 1,
        delay: 1,
      })
      .to(stars.current, 1, { scale: 1, y: 70, x: 60 }, '-=1');
    if (inView) animation.resume();
  }, [animation, inView]);

  return (
    <>
      <H2>Prototype Quickly</H2>
      <P muted>Test your ideas early and often.</P>
      <Grid>
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
          <P muted>You just need a web browser.</P>
          <H5>No setup</H5>
          <P muted>Go straight to coding with templates.</P>
          <H5>VS Code built-in </H5>
          <P muted>The editor’s full-featured, yet familiar.</P>

          <div ref={parallaxRef}>
            <Tweet
              style={`
                background: #242424
              `}
              tweet={{
                name: 'Jonnie Hallman',
                username: 'destroytoday',
                job: 'Designer Developer, Stripe',
                quote: 'It feels much more like my local environment.',
                url:
                  'https://twitter.com/destroytoday/status/1173805935384350720',
              }}
            />
          </div>
        </div>
      </Grid>
    </>
  );
};

export default Prototype;
