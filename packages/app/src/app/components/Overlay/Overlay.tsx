import React from 'react';
import { useTransition, animated, config } from 'react-spring';
import track from '@codesandbox/common/lib/utils/analytics';
import { usePopoverState, Popover, PopoverDisclosure } from 'reakit/Popover';
import { Container } from './elements';

interface IOverlayProps {
  event: string;
  isOpen?: boolean;
  onOpen?: () => void;
  onClose?: () => void;
  children: (any) => React.ReactNode;
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
  const isControlled = isOpen !== undefined;
  const popover = usePopoverState({
    visible: isControlled ? isOpen : undefined,
    placement: 'bottom-end',
  });

  React.useEffect(() => {
    if (popover.visible) {
      track(`Opened ${event}`);
      if (isControlled) {
        onOpen();
      }
    } else {
      track(`Closed ${event}`);
      if (isControlled) {
        onClose();
      }
    }
  }, [event, isControlled, onClose, onOpen, popover.visible]);

  const transitions = useTransition(popover.visible, null, {
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
    <Container>
      <PopoverDisclosure {...popover}>
        {props => children(props)}
      </PopoverDisclosure>
      <Popover unstable_portal {...popover} aria-label={event}>
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
      </Popover>
    </Container>
  );
};
