import React, { useState, useEffect } from 'react';
import { Transition, animated, config } from 'react-spring/renderprops';
import track from '@codesandbox/common/lib/utils/analytics';
import { Container } from './elements';

interface IOverlayProps {
  event: string;
  isOpen?: boolean;
  onOpen?: () => void;
  onClose?: () => void;
  children: (handleOpen: () => void) => React.ReactNode;
  content: React.ComponentClass<any> | React.StatelessComponent<any>;
  noHeightAnimation: boolean;
}

const Overlay = ({
  event,
  isOpen,
  onOpen,
  onClose,
  children,
  content: Content,
  noHeightAnimation,
}: IOverlayProps) => {
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

  return (
    <Container onMouseDown={e => e.preventDefault()}>
      {children(handleOpen)}
      <Transition
        // Find a better way of doing this, copied from original implementation
        // which appears hacky and makes typescript angry
        // @ts-ignore
        items={openState}
        from={{
          height: noHeightAnimation ? undefined : 0,
          opacity: 0.6,
          position: 'absolute',
          top: 'calc(100% + 1rem)',
          right: 0,
          zIndex: 10,
          overflow: 'hidden',
          boxShadow: '0 3px 3px rgba(0, 0, 0, 0.3)',
        }}
        enter={{ height: noHeightAnimation ? undefined : 'auto', opacity: 1 }}
        leave={{ height: noHeightAnimation ? undefined : 0, opacity: 0 }}
        native
        // @ts-ignore
        config={config.fast}
      >
        {visible =>
          visible
            ? style => (
                <animated.div style={style}>
                  <Content />
                </animated.div>
              )
            : style => <animated.span style={style} />
        }
      </Transition>
    </Container>
  );
};

export default Overlay;
