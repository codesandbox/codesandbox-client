import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Socket } from 'phoenix';

import Button from '../../../components/Button';
import {
  HeroWrapper,
  SignUp,
  Border,
  StyledEditorLink,
  HeroImage,
  HeroBottom,
  CountText,
  Title,
  SubTitle,
  InspiredText,
} from './elements';

import hero from '../../../assets/images/hero-ide-home.png';

import BoxAnimation from './BoxAnimation';
import { applyParallax } from '../../../utils/parallax';

export default () => {
  const [boxes, setBoxes] = useState([
    { position: [0, 0, 10], rotation: [1.2, 0, 0], key: 'initial' },
  ]);
  const [sandboxesCreatedCount, setSandboxesCreatedCount] = useState(1);
  const [showPlane, setShowPlane] = useState(true);

  const createBox = React.useCallback(() => {
    setBoxes(b => {
      if (b.length > 10) {
        setShowPlane(false);
        setTimeout(() => {
          setShowPlane(true);

          setBoxes(bb => {
            const newBoxes = [...bb];
            newBoxes.length = 1;
            return newBoxes;
          });
        }, 1000);
      }
      const newBoxes = [
        {
          key: Math.floor(Math.random() * 10000) + '',
          position: [-5 + Math.random() * 10, 0 + Math.random() * 2.5, 15],
          rotation: [Math.random() * 1, Math.random() * 1, Math.random() * 1],
        },
        ...b,
      ];

      return newBoxes;
    });
  }, [setBoxes]);

  const socketRef = useRef(
    typeof window === 'undefined'
      ? undefined
      : new Socket('wss://codesandbox.io/anon-socket')
  );

  useEffect(() => {
    const socket = socketRef.current;
    if (socket) {
      socket.connect();

      const channel = socket.channel('sandbox-created', {});
      channel.join();
      channel.on('new-sandbox', () => {
        if (document.hasFocus()) {
          createBox();
        }

        setSandboxesCreatedCount(i => i + 1);
      });

      return () => {
        channel.leave();
        socket.disconnect();
      };
    }
    return () => {};
  }, [createBox]);

  const ideRef = useRef();

  useEffect(() => {
    applyParallax(ideRef.current, {
      speed: 2,
      center: true,
    });
  }, []);

  return (
    <HeroWrapper>
      <BoxAnimation boxes={boxes} showPlane={showPlane} />

      <motion.div
        initial={{ opacity: 0, y: 140 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: 'easeOut', staggerChildren: 0.5 }}
        style={{
          zIndex: 20,
          position: 'absolute',
          top: '15%',
          left: 0,
          right: 0,
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

      <HeroBottom>
        <div ref={ideRef}>
          <CountText>
            <span style={{ fontWeight: 600, color: 'white' }}>
              {sandboxesCreatedCount}{' '}
            </span>
            {sandboxesCreatedCount === 1 ? 'sandbox' : 'sandboxes'} created
            since you've opened this page
          </CountText>

          <div style={{ position: 'relative' }}>
            <StyledEditorLink
              href="/s/m7q0r29nn9"
              target="_blank"
              rel="noreferrer noopener"
            >
              <InspiredText>
                Inspired by the sandboxes created by drcmda
              </InspiredText>
              Open Sandbox
            </StyledEditorLink>

            <HeroImage alt="editor with project open" src={hero} />
          </div>
        </div>
      </HeroBottom>

      <Border />
    </HeroWrapper>
  );
};
