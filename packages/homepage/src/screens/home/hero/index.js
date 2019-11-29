import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from 'styled-components';
import Button from '../../../components/Button';
import hero from '../../../assets/images/hero.png';
import { H2, P } from '../../../components/Typography';
import { HeroWrapper, SignUp, ImageWrapper, Border } from './elements';

export default () => {
  const greyDark = useTheme().homepage.greyDark;
  return (
    <HeroWrapper>
      <motion.div
        initial={{ opacity: 0, y: 140 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 1,
          ease: 'easeOut',
        }}
      >
        <H2 as="h1">Web Development Made Faster</H2>
        <P
          small
          css={`
            margin-bottom: 2rem;
          `}
        >
          An instant IDE and prototyping tool for rapid web development.
        </P>
        <Button href="/s">Create a Sandbox, it’s free</Button>
        <SignUp>No signup required</SignUp>
      </motion.div>

      <ImageWrapper>
        <motion.img
          initial={{ opacity: 0, y: 120, boxShadow: `0 0 0 ${greyDark}` }}
          animate={{ opacity: 1, y: 0, boxShadow: `0 -4px 20px ${greyDark}` }}
          transition={{
            duration: 1,
            delay: 0.3,
            ease: 'easeOut',
          }}
          src={hero}
          alt="browser showing codesandbox running"
        />
        <Border />
      </ImageWrapper>
    </HeroWrapper>
  );
};
