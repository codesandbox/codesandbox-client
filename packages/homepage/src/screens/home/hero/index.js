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
      }}
    >
      <Title>Quickly prototype ideas&nbsp;with&nbsp;code</Title>
      <SubTitle
        css={`
          margin-bottom: 2rem;
        `}
      >
        Free, instant, collaborative sandboxes for
        rapid&nbsp;web&nbsp;development.
      </SubTitle>

      <SandboxButtons>
        <Sandbox href="/s/new" title="React" style={{ animationDelay: '0.5s' }}>
          <img src={react} alt="React Template" />
        </Sandbox>
        <Sandbox
          href="/s/vanilla"
          title="Vanilla"
          style={{
            animationDelay: '0.6s',
          }}
        >
          <img src={vanilla} alt="Vanilla Template" />
        </Sandbox>
        <Sandbox href="/s/vue" title="Vue" style={{ animationDelay: '0.7s' }}>
          <img src={vue} alt="Vue Template" />
        </Sandbox>
        <Sandbox
          href="/s/angular"
          title="Angular"
          style={{
            animationDelay: '0.8s',
          }}
        >
          <img src={angular} alt="angular Template" />
        </Sandbox>
        <Sandbox
          href="/s/github/codesandbox-app/static-template/tree/master/"
          title="HTML 5"
          style={{
            animationDelay: '0.9s',
          }}
        >
          <img src={html} alt="HTML Template" />
        </Sandbox>
        <Sandbox href="/s" title="More" style={{ animationDelay: '1.0s' }}>
          <img src={more} alt="More Template" />
        </Sandbox>
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
