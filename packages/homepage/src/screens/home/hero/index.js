import React from 'react';
import { motion } from 'framer-motion';
import Button from '../../../components/Button';
import { H2, P } from '../../../components/Typography';
import { HeroWrapper, SignUp, Border } from './elements';

import hero from '../../../assets/images/hero-ide-home.png';

import BoxAnimation from './BoxAnimation';

export default () => (
  <HeroWrapper>
    <BoxAnimation />

    <motion.div
      initial={{ opacity: 0, y: 140 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, ease: 'easeOut' }}
      style={{
        zIndex: 20,
        position: 'absolute',
        top: 150,
        left: 0,
        right: 0,
        textAlign: 'center',
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
      <Button
        style={{ padding: '.75rem 2rem', marginBottom: '.5rem' }}
        href="/s"
      >
        Create a Sandbox, it’s free
      </Button>
      <SignUp>No signup required</SignUp>
    </motion.div>

    <div
      style={{
        position: 'absolute',
        top: 700,
        left: 0,
        right: 0,
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      <img src={hero} style={{ maxWidth: 1200 }} />
    </div>

    <Border />
  </HeroWrapper>
);
