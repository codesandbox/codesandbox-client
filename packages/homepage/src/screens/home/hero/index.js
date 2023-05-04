import React from 'react';
import { motion } from 'framer-motion';

import { HeroWrapper, Title, SubTitle } from './elements';
import { Content } from './Content';

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
      <Title>
        Where teams build <br /> faster, together.
      </Title>
      <SubTitle
        css={`
          margin-bottom: 3.7rem;
        `}
      >
        Create, share, and get feedback with collaborative <br /> sandboxes for
        rapid web development.
      </SubTitle>

      <Content />
    </motion.div>
  </HeroWrapper>
);
