import React from 'react';
import styled from 'styled-components';
import css from '@styled-system/css';
import { AnimatePresence, motion } from 'framer-motion';
import track from '@codesandbox/common/lib/utils/analytics';

import { Text } from '@codesandbox/components';

import { EmbedIcon } from '../icons';

const OnBoarding = ({ visibility, onClose }) => (
  <AnimatePresence>
    {visibility && (
      <Container
        initial={{ opacity: 0, scale: 0.7 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.7 }}
      >
        <CloseButton
          onClick={() => {
            onClose();
            track('Editor - Close - Share onboarding');
          }}
        >
          <svg width={9} height={9} fill="none">
            <path
              d="M8.672.868L7.95.14 4.702 3.413 1.454.14.733.868 3.98 4.14.733 7.413l.721.727 3.248-3.272L7.95 8.14l.722-.727L5.424 4.14 8.672.868z"
              fill="#fff"
            />
          </svg>
        </CloseButton>

        <Image src="/static/img/livesession-onboarding.jpeg" alt="Example" />
        <Text as="h3" size={3} css={{ display: 'block', marginBottom: '.5em' }}>
          <EmbedIcon
            css={css({
              height: 3,
              marginRight: 1,
              top: '1px',
              position: 'relative',
            })}
          />
          Share
        </Text>
        <Text css={{ opacity: 0.6, lineHeight: 1.6 }}>
          A link is all you need to hop into a sandbox and keep development work
          flowing.
        </Text>
      </Container>
    )}
  </AnimatePresence>
);

const CloseButton = styled.button`
  background: none;
  border: 0;
  cursor: pointer;
  opacity: 0;
  transition: opacity 0.3s ease;

  width: 44px;
  height: 44px;
  display: flex;

  svg {
    margin: auto;
  }

  position: absolute;
  right: 0;
  top: 0;
  padding: 0;
`;

const Container = styled(motion.div)`
  background-color: ${({ theme }) =>
    theme['input.background'] || theme.background()};
  color: ${({ theme }) => theme.colors.dialog.foreground};
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.12), 0px 16px 32px rgba(0, 0, 0, 0.24);

  width: 245px;
  padding: 1em;
  border-radius: 4px;
  overflow: hidden;

  border: 1px solid ${({ theme }) => theme.colors.dialog.border};

  position: absolute;
  top: 30px;
  left: calc(245px / -2 + 70px / 4);
  z-index: 99999;

  transform-origin: 50% 0%;

  &:hover ${CloseButton} {
    opacity: 1;
  }
`;

const Image = styled.img`
  width: calc(100% + 2em);
  margin-left: -1em;
  margin-top: -1em;
`;

export { OnBoarding };
