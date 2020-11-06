import React from 'react';
import { motion } from 'framer-motion';
import styled from 'styled-components';
import { H2, P } from '../../../components/Typography';

import brian from '../../../assets/images/quotes/brian.png';
import peggy from '../../../assets/images/quotes/peggy.png';
import apollo from '../../../assets/images/quotes/apollo.png';
import stripe from '../../../assets/images/quotes/stripe.png';
import jonnie from '../../../assets/images/quotes/jonnie.png';
import react from '../../../assets/images/quotes/react.png';

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
  margin-bottom: 56px;

  ${props => props.theme.breakpoints.md} {
    grid-template-columns: repeat(3, 1fr);
  }

  @media screen and (max-width: 767px) {
    grid-gap: 24px;
    grid-template-columns: 1fr;
  }

  ${props => props.theme.breakpoints.sm} {
    grid-template-columns: 1fr;
  }
`;
const Feature = styled(motion.div)`
  display: flex;
  align-items: center;
  flex-direction: column;
  padding: 44px 16px;
  border: 0.572728px solid #343434;
  border-radius: 4px;
  text-align: center;
  background: #151515;

  svg,
  h3 {
    margin-bottom: 16px;
  }
`;

const Quotes = () => (
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
    <H2
      css={`
        text-align: center;
        margin-bottom: 80px;
      `}
    >
      What others are saying
    </H2>
    <Grid variants={container} initial="hidden" animate="show">
      <Feature variants={item}>
        <P
          css={`
            font-weight: 400;
            min-height: 104px;
          `}
        >
          “It's dramatically improved my experience of sharing ideas”
        </P>
        <div
          css={`
            position: relative;
          `}
        >
          <img width={64} height={64} src={brian} alt="Brian Vaughn" />
          <img
            width={42}
            height={42}
            src={react}
            alt="React Team"
            css={`
              position: absolute;
              right: -35px;
              bottom: 0;
            `}
          />
        </div>
        <P
          css={`
            margin-top: 32px;
            margin-bottom: 8px;
            font-weight: 700;
          `}
        >
          Brian Vaughn
        </P>
        <P
          muted
          css={`
            font-size: 13px;
            margin: 0;
          `}
        >
          Software Engineer, React Core Team
        </P>
      </Feature>
      <Feature variants={item}>
        <P
          css={`
            min-height: 104px;
            font-weight: 400;
          `}
        >
          “CodeSandbox continues to amaze me every day”
        </P>
        <div
          css={`
            position: relative;
          `}
        >
          <img width={64} height={64} src={peggy} alt="Peggy Rayzis" />
          <img
            width={42}
            height={42}
            src={apollo}
            alt="apollo"
            css={`
              position: absolute;
              right: -25px;
              bottom: 0;
            `}
          />
        </div>
        <P
          css={`
            margin-top: 32px;
            margin-bottom: 8px;
            font-weight: 700;
          `}
        >
          Peggy Rayzis
        </P>
        <P
          muted
          css={`
            font-size: 13px;
            margin: 0;
          `}
        >
          Engineering Manager, Apollo GraphQL
        </P>
      </Feature>
      <Feature variants={item}>
        <P
          css={`
            min-height: 104px;
            font-weight: 400;
          `}
        >
          “It feels much more like my local environment”
        </P>
        <div
          css={`
            position: relative;
          `}
        >
          <img width={64} height={64} src={jonnie} alt="Jonnie Hallman" />
          <img
            width={42}
            height={42}
            src={stripe}
            alt="Stripe"
            css={`
              position: absolute;
              right: -26px;
              bottom: -6px;
            `}
          />
        </div>
        <P
          css={`
            margin-top: 32px;
            margin-bottom: 8px;
            font-weight: 700;
          `}
        >
          Jonnie Hallman
        </P>
        <P
          muted
          css={`
            font-size: 13px;
            margin: 0;
          `}
        >
          Designer Developer, Stripe
        </P>
      </Feature>
    </Grid>
  </div>
);

export default Quotes;
