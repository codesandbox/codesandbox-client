import React from 'react';
import { motion } from 'framer-motion';
import styled from 'styled-components';

import { P, H3 } from '../../../components/Typography';
import { PrototypingIcon, KnowledgeIcon, FeedbackIcon } from './icons';

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
  padding: 0 0 10rem 0;

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

const DevExperienceOne = () => (
  <div
    css={`
      margin: 5rem 0;

      @media screen and (max-width: 1023px) {
        margin-bottom: 130px;
      }
      * {
        position: relative;
        z-index: 1;
      }
    `}
  >
    <Grid variants={container} initial="hidden" animate="show">
      <Feature variants={item}>
        <PrototypingIcon />
        <H3>Rapid prototyping</H3>
        <P muted small>
          Quickly create real, working prototypes. Test ideas earlier and
          iterate more.
        </P>
      </Feature>
      <Feature variants={item}>
        <KnowledgeIcon />

        <H3>Knowledge sharing</H3>
        <P muted small>
          Use code, apps, and templates collectively. Learn from each other and
          bake-in best practice.
        </P>
      </Feature>
      <Feature variants={item}>
        <FeedbackIcon />
        <H3>Better feedback</H3>
        <P muted small>
          Give and get feedback, on code or visuals, right in the editor. Take
          action and move forward faster.
        </P>
      </Feature>
    </Grid>
  </div>
);

export default DevExperienceOne;
