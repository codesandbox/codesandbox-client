import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Socket } from 'phoenix';

import Button from '../../../components/Button';
import { H2, P } from '../../../components/Typography';
import { HeroWrapper, SignUp, Border, StyledEditorLink } from './elements';

import hero from '../../../assets/images/hero-ide-home.png';

import BoxAnimation from './BoxAnimation';

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
        },
        ...b,
      ];

      return newBoxes;
    });
  }, [setBoxes]);

  const socketRef = useRef(new Socket('/anon-socket'));

  useEffect(() => {
    const socket = socketRef.current;
    socket.connect();

    const channel = socket.channel('sandbox-created', {});
    channel.join();
    channel.on('new-sandbox', () => {
      createBox();
      setSandboxesCreatedCount(i => i + 1);
    });

    return () => {
      socket.disconnect();
    };
  }, [createBox, socketRef]);

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
          bottom: '-30%',
          left: 0,
          right: 0,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <div
          style={{ fontSize: '1.25rem', color: '#ccc', marginBottom: '1rem' }}
        >
          {sandboxesCreatedCount}{' '}
          {sandboxesCreatedCount === 1 ? 'sandbox' : 'sandboxes'} created since
          you opened this page
        </div>

        <div style={{ position: 'relative' }}>
          <StyledEditorLink
            href="/s/m7q0r29nn9"
            target="_blank"
            rel="noreferrer noopener"
          >
            Open Project in CodeSandbox
          </StyledEditorLink>
          <img
            alt="editor with project open"
            src={hero}
            style={{
              maxWidth: 1200,
              overflow: 'hidden',
              borderRadius: 4,
              boxShadow: '0 10px 10px rgba(0, 0, 0, 0.5)',
            }}
          />
        </div>
      </div>

      <Border />
    </HeroWrapper>
  );
};
