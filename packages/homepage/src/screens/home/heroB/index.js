import React, { useRef } from 'react';
import { motion } from 'framer-motion';

import Button from '../../../components/Button';
import {
  HeroWrapper,
  SignUp,
  Border,
  SandboxButtons,
  Sandbox,
  HeroImage,
  HeroBottom,
  Title,
  SubTitle,
} from './elements';

import hero from '../../../assets/images/hero-ide-home.png';

import react from '../../../assets/icons/home-react.svg';
import vanilla from '../../../assets/icons/home-js.svg';
import vue from '../../../assets/icons/home-vue.svg';
import angular from '../../../assets/icons/home-angular.svg';
import more from '../../../assets/icons/home-more.svg';

export default () => {
  const ideRef = useRef();

  return (
    <HeroWrapper>
      <motion.div
        initial={{ opacity: 0, y: 140 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: 'easeOut', staggerChildren: 0.5 }}
        style={{
          zIndex: 20,
          position: 'absolute',
          top: '15%',
          textAlign: 'center',
        }}
      >
        <Title>Web Development Made Faster</Title>
        <SubTitle
          css={`
            margin-bottom: 2rem;
          `}
        >
          An instant IDE and prototyping tool for rapid web development.
        </SubTitle>

        <SandboxButtons>
          <Sandbox href="/s/new" style={{ backgroundImage: `url(${react})` }} />
          <Sandbox
            href="/s/vanilla"
            style={{ backgroundImage: `url(${vanilla})` }}
          />
          <Sandbox href="/s/vue" style={{ backgroundImage: `url(${vue})` }} />
          <Sandbox
            href="/s/angular"
            style={{ backgroundImage: `url(${angular})` }}
          />
          <Sandbox href="/s" style={{ backgroundImage: `url(${more})` }} />
        </SandboxButtons>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut', delay: 0.5 }}
        >
          <Button
            style={{ padding: '.75rem 2rem', marginBottom: '.5rem' }}
            href="/s"
          >
            Create a Sandbox, it’s free
          </Button>
          <SignUp>No signup required</SignUp>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.8,
          delay: 1,
        }}
      >
        <HeroBottom>
          <div ref={ideRef}>
            <div style={{ position: 'relative' }}>
              <HeroImage alt="editor with project open" src={hero} />
            </div>
          </div>
        </HeroBottom>
      </motion.div>

      <Border />
    </HeroWrapper>
  );
};
