import React, { useRef, useEffect } from 'react';

import styled from 'styled-components';
import { H2, P, H3 } from '../../../components/Typography';

import { applyParallax } from '../../../utils/parallax';
import usePrefersReducedMotion from '../../../utils/isReducedMOtion';
import { BGIcon, GHIcon, NPMIcon, OptimizedIcon } from './icons';

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 38px;
  margin-bottom: 56px;

  ${props => props.theme.breakpoints.lg} {
    grid-template-columns: 1fr;
  }
`;
const Feature = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  padding: 24px;
  padding-bottom: 56px;
  border: 0.572728px solid #131212;
  border-radius: 4px;
  text-align: center;
  background: #040404;

  svg,
  h3 {
    margin-bottom: 16px;
  }
`;

const DevExperience = () => {
  const parallaxRef = useRef(null);
  const parallaxRef1 = useRef(null);
  const parallaxRef2 = useRef(null);
  const prefersReducedMotion = usePrefersReducedMotion();
  useEffect(() => {
    if (!prefersReducedMotion) {
      applyParallax(parallaxRef.current, {
        speed: 1.1,
        center: true,
      });
      applyParallax(parallaxRef1.current, {
        speed: 1.1,
        center: true,
      });
      applyParallax(parallaxRef2.current, {
        speed: 1.1,
        center: true,
      });
    }
  }, [parallaxRef, prefersReducedMotion]);

  return (
    <div
      css={`
        margin-bottom: 320px;

        @media screen and (max-width: 1023px) {
          margin-bottom: 130px;
        }
        * {
          position: relative;
          z-index: 1;
        }
      `}
    >
      <BGIcon
        css={`
          position: absolute;
          z-index: 0;
          right: 0;
          opacity: 0.89;

          @media screen and (max-width: 1023px) {
            display: none;
          }
        `}
      />
      <H2
        css={`
          text-align: center;
          margin-bottom: 80px;
        `}
      >
        The best JavaScript dev experience
      </H2>
      <Grid>
        <Feature ref={parallaxRef}>
          <NPMIcon />
          <H3>Supercharged with npm</H3>
          <P muted>
            Use any of the 1M+ packages to build real, powerful apps quickly and
            efficiently.
          </P>
        </Feature>
        <Feature ref={parallaxRef1}>
          <OptimizedIcon />
          <H3>Optimized for frameworks</H3>
          <P muted>
            Custom environments built specifically for React, Vue, Angular, and
            many more.
          </P>
        </Feature>
        <Feature ref={parallaxRef2}>
          <GHIcon />
          <H3>Integrated with GitHub</H3>
          <P muted>
            Import and run repos direct from GitHub. Or export your sandbox to a
            repo.
          </P>
        </Feature>
      </Grid>
    </div>
  );
};

export default DevExperience;
