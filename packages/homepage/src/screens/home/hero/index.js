import React from 'react';
import { motion } from 'framer-motion';
import Button from '../../../components/Button';
import hero from '../../../assets/images/hero.png';
import { H2, P } from '../../../components/Typography';
import { HeroWrapper, SignUp } from './elements';

export default () => (
  <HeroWrapper>
    <H2 as="h1">CodeSandbox</H2>
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
    <motion.img
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.4,
        ease: 'easeInOut',
      }}
      src={hero}
      alt="browser showing codesandbox running"
    />
  </HeroWrapper>
);
