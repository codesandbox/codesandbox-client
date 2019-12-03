import React from 'react';
import { motion, useMotionValue } from 'framer-motion';
import { useTheme } from 'styled-components';
import theme from '@codesandbox/common/lib/theme';
import Button from '../../../components/Button';
import { H2, P } from '../../../components/Typography';
import Cube from '../../../components/Cube';
import {
  HeroWrapper,
  SignUp,
  ImageWrapper,
  Border,
  EditorElement,
} from './elements';

import heroActivityBar from '../../../assets/images/hero/activitybar.png';
import heroSidebar from '../../../assets/images/hero/sidebar.png';
import heroNavbar from '../../../assets/images/hero/navbar.png';
import heroChrome from '../../../assets/images/hero/chrome.png';
import heroEditor from '../../../assets/images/hero/editor.png';
import heroPreview from '../../../assets/images/hero/preview.png';

export default () => {
  const greyDark = useTheme().homepage.greyDark;

  const translate = useMotionValue(0);
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

      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          zIndex: 200,
          perspective: 750,
          transform: 'translateZ(200px)',
        }}
      >
        <Cube noAnimation color={theme.secondary} speed={5} />
      </div>

      <ImageWrapper>
        <EditorElement i={4} src={heroNavbar} />
        <div style={{ display: 'flex' }}>
          <EditorElement i={3} src={heroActivityBar} />
          <EditorElement i={2} src={heroSidebar} />
          <EditorElement i={1} src={heroEditor} />
          <EditorElement i={0} src={heroPreview} />
        </div>
      </ImageWrapper>
      <Border />
    </HeroWrapper>
  );
};
