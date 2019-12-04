import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Socket } from 'phoenix';

import * as templates from '@codesandbox/common/lib/templates/index';
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
} from './elements';

import hero from '../../../assets/images/hero-ide-home.png';

import BoxAnimation from './BoxAnimation';

const templateKeys = Object.keys(templates).filter(x => x !== 'default');

export default () => {
  const [boxes, setBoxes] = useState([]);
  const [sandboxesCreatedCount, setSandboxesCreatedCount] = useState(0);
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
          position: [-5 + Math.random() * 10, -2.5 + Math.random() * 5, 15],
          color: templates[
            templateKeys[Math.floor(Math.random() * templateKeys.length)]
          ].color(),
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
        createBox();
        setSandboxesCreatedCount(i => i + 1);
      });

      return () => {
        channel.leave();
        socket.disconnect();
      };
    }
    return () => {};
  }, [createBox]);

  return (
    <HeroWrapper>
      <BoxAnimation boxes={boxes} showPlane={showPlane} />

      <motion.div
        initial={{ opacity: 0, y: 140 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: 'easeOut' }}
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
        <Button
          style={{ padding: '.75rem 2rem', marginBottom: '.5rem' }}
          href="/s"
        >
          Create a Sandbox, it’s free
        </Button>
        <SignUp>No signup required</SignUp>
      </motion.div>

      <HeroBottom>
        <CountText>
          <span style={{ fontWeight: 600, color: 'white' }}>
            {sandboxesCreatedCount}{' '}
          </span>
          {sandboxesCreatedCount === 1 ? 'sandbox' : 'sandboxes'} created since
          you've opened this page
        </CountText>

        <div style={{ position: 'relative' }}>
          <StyledEditorLink
            href="/s/m7q0r29nn9"
            target="_blank"
            rel="noreferrer noopener"
          >
            Open Project in CodeSandbox
          </StyledEditorLink>
          <HeroImage
            alt="editor with project open"
            src={hero}
            style={{
              maxWidth: 1200,
              minWidth: '100%',
              overflow: 'hidden',
              borderRadius: 4,
              boxShadow: '0 10px 10px rgba(0, 0, 0, 0.5)',
            }}
          />
        </div>
      </HeroBottom>

      <Border />
    </HeroWrapper>
  );
};
