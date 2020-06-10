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

          <Sandbox
            href="/s/new"
            title="React"
            style={{ backgroundImage: `url(${react})`, animationDelay: '0.5s' }}
          />
          <Sandbox
            href="/s/vanilla"
            title="Vanilla"
            style={{
              backgroundImage: `url(${vanilla})`,
              animationDelay: '0.6s',
            }}
          />
          <Sandbox
            href="/s/vue"
            title="Vue"
            style={{ backgroundImage: `url(${vue})`, animationDelay: '0.7s' }}
          />
          <Sandbox
            href="/s/angular"
            title="Angular"
            style={{
              backgroundImage: `url(${angular})`,
              animationDelay: '0.8s',
            }}
          />
          <Sandbox
            href="/s"
            title="More"
            style={{ backgroundImage: `url(${more})`, animationDelay: '0.9s' }}
          />

        </SandboxButtons>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut', delay: 0.5 }}
        >
          <Button
            style={{
              padding: '.75rem 2rem',
              marginBottom: '.5rem',
              borderRadius: '.25rem',
            }}
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
