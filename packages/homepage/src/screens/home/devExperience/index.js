import React from 'react';
import { motion } from 'framer-motion';
import styled from 'styled-components';
import { H2, P, H3 } from '../../../components/Typography';
import { BGIcon, GHIcon, NPMIcon, OptimizedIcon } from './icons';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const item = {
  hidden: { opacity: 0 },
  show: { opacity: 1 },
};

const Grid = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 38px;
  margin: 4rem 0;

  @media screen and (max-width: 900px) {
    grid-gap: 20px;
    grid-template-columns: repeat(3, 1fr);
  }

  @media screen and (max-width: 767px) {
    grid-gap: 1rem;
    grid-template-columns: 1fr;
  }
`;
const Feature = styled(motion.div)`
  display: flex;
  align-items: center;
  flex-direction: column;
  padding: 4rem;
  // border: 0.5px solid #343434;
  border-radius: 4px;
  text-align: center;
  background: #151515;

  @media screen and (max-width: 900px) {
    padding: 1rem;
  }

  svg,
  h3 {
    margin-bottom: 16px;
  }
`;

const DevExperience = () => (
  <div
    css={`
      margin: 10rem 0 20rem 0;

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
        margin-top: -6rem;
        opacity: 0.89;
        width: 100vw;
        border-bottom: 0.5px solid #343434;

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
      The best JavaScript <br /> dev experience.
    </H2>
    <Grid variants={container} initial="hidden" animate="show">
      <Feature variants={item}>
        <NPMIcon />
        <H3>
          Supercharged <br /> with npm
        </H3>
        <P muted small>
          Use private packages, or any of the 1M+ public ones, to build powerful
          apps quickly.
        </P>
      </Feature>
      <Feature variants={item}>
        <OptimizedIcon />
        <H3>
          Optimized for <br /> frameworks
        </H3>
        <P muted small>
          Custom environments built specifically for React, Vue, Angular, and
          many more.
        </P>
      </Feature>
      <Feature variants={item}>
        <GHIcon />
        <H3>
          Integrated <br /> with GitHub
        </H3>
        <P muted small>
          Import and run repos direct from GitHub. Or export your sandbox to a
          repo.
        </P>
      </Feature>
    </Grid>
  </div>
);

export default DevExperience;
