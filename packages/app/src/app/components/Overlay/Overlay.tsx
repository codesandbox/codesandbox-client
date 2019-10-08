import React, { useState, useEffect } from 'react';
import { useTransition, animated, config } from 'react-spring';
import track from '@codesandbox/common/lib/utils/analytics';
import { Container } from './elements';

interface IOverlayProps {
  event: string;
  isOpen?: boolean;
  onOpen?: () => void;
  onClose?: () => void;
  children: (handleOpen: () => void) => React.ReactNode;
  content: React.ComponentType;
  noHeightAnimation?: boolean;
}

export const Overlay: React.FC<IOverlayProps> = ({
  event,
  isOpen,
  onOpen = () => {},
  onClose = () => {},
  children,
  content: Content,
  noHeightAnimation = true,
}) => {
  const [open, setOpen] = useState(isOpen === undefined ? false : isOpen);
  const isControlled = isOpen !== undefined;
  const openState = isControlled ? isOpen : open;

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (!e.defaultPrevented && openState) {
        if (event) {
          track(`Closed ${event}`);
        }
        if (isControlled) {
          if (onClose) {
            onClose();
          }
        } else {
          setOpen(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClick);

    return () => {
      document.removeEventListener('mousedown', handleClick);
    };
  }, [isOpen, onClose, event, openState, isControlled]);

  const handleOpen = () => {
    if (event) {
      track(`Opened ${event}`);
    }
    if (isControlled) {
      if (onOpen) {
        onOpen();
      }
    } else {
      setOpen(true);
    }
  };

  const transitions = useTransition(openState, null, {
    config: config.default,
    from: {
      ...(noHeightAnimation ? {} : { height: 0 }),
      opacity: 0.6,
      position: 'absolute',
      top: 'calc(100% + 1rem)',
      right: 0,
      zIndex: 10,
      overflow: 'hidden',
      boxShadow: '0 3px 3px rgba(0, 0, 0, 0.3)',
    },
    enter: { ...(noHeightAnimation ? {} : { height: 'auto' }), opacity: 1 },
    leave: { ...(noHeightAnimation ? {} : { height: 0 }), opacity: 0 },
  });

  return (
    <Container onMouseDown={e => e.preventDefault()}>
      {children(handleOpen)}
      {transitions.map(({ item, props }, i) =>
        item ? (
          // eslint-disable-next-line
          <animated.div key={i} style={props}>
            <Content />
          </animated.div>
        ) : (
          // eslint-disable-next-line
          <animated.span key={i} style={props} />
        )
      )}
    </Container>
  );
};
