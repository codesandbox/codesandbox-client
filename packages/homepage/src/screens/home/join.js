import React from 'react';

import styled from 'styled-components';
import { down } from 'styled-breakpoints';

import { motion, useViewportScroll, useTransform } from 'framer-motion';
import HeroSmall from '../../assets/images/small-ide.png';
import Button from '../../components/Button';

const JoinWrapper = styled.section`
  margin-top: 13.5rem;
  display: grid;
  grid-template-columns: 1fr 615px;
  width: 100%;
  text-align: center;
  background: #151515;
  min-height: 322px;
  position: relative;
  align-items: center;
  border-radius: 0.25rem;
  border: 1px solid #242424;
  overflow: hidden;

  ${down('md')} {
    grid-template-columns: 1fr;
  }
`;

const IDE = styled.img`
  position: absolute;
  margin-top: -6rem;
  right: 0;
  box-shadow: 0 0.24rem 0.5rem rgba(0, 0, 0, 0.24);

  ${down('md')} {
    position: relative;
    margin: 0;
    margin-top: 2rem;
  }
`;

const Text = styled.h3`
  font-weight: 500;
  font-size: 36px;
  line-height: 43px;
  font-family: ${props => props.theme.homepage.appleFont};
  color: ${props => props.theme.homepage.white};
  max-width: 80%;
  margin: auto;
  margin-bottom: 2.5rem;

  ${down('md')} {
    margin-top: 2rem;
  }
`;

const Join = ({ src, ...style }) => {
  const { scrollY } = useViewportScroll();
  const y = useTransform(scrollY, [0, 20], [0, 5], { clamp: true });

  return (
    <>
      <JoinWrapper>
        <div>
          <Text>Join millions of people prototyping what’s next</Text>
          <Button href="/s">Create Sandbox, it’s free</Button>
        </div>
        <motion.div style={{ ...style, y }}>
          <IDE src={HeroSmall} alt="safari with codesandbox" />
        </motion.div>
      </JoinWrapper>
    </>
  );
};

export default Join;
