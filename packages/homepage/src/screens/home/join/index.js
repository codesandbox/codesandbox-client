import React from 'react';
import { motion, useViewportScroll, useTransform } from 'framer-motion';
import HeroSmall from '../../../assets/images/small-ide.png';
import Button from '../../../components/Button';

import { JoinWrapper, IDE, Text } from './elements';

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
        <motion.div
          css={`
            align-self: flex-end;
          `}
          style={{ ...style, y }}
        >
          <IDE src={HeroSmall} alt="safari with codesandbox" />
        </motion.div>
      </JoinWrapper>
    </>
  );
};

export default Join;
