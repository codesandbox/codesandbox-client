import React from 'react';
import { motion } from 'framer-motion';

import Button from '../../../components/Button';
import {
  HeroWrapper,
  SandboxButtons,
  Sandbox,
  Title,
  SubTitle,
} from './elements';

import react from '../../../assets/icons/home-react.svg';
import vanilla from '../../../assets/icons/home-js.svg';
import vue from '../../../assets/icons/home-vue.svg';
import angular from '../../../assets/icons/home-angular.svg';
import html from '../../../assets/icons/home-html.svg';
import more from '../../../assets/icons/home-more.svg';

export default () => (
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
      <Title>Quickly prototype ideas with code</Title>
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
          href="/s/github/codesandbox-app/static-template/tree/master/"
          title="HTML 5"
          style={{
            backgroundImage: `url(${html})`,
            animationDelay: '0.9s',
          }}
        />
        <Sandbox
          href="/s"
          title="More"
          style={{ backgroundImage: `url(${more})`, animationDelay: '1.0s' }}
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
      </motion.div>
    </motion.div>
  </HeroWrapper>
);
