import React, {
  useState,
  useLayoutEffect,
  useEffect,
  useCallback,
} from 'react';
import { motion } from 'framer-motion';
import track from '@codesandbox/common/lib/utils/analytics';
import Portal from '@codesandbox/common/lib/components/Portal';
import { ESC } from '@codesandbox/common/lib/utils/keycodes';
import { Container, ContentContainer } from './elements';

interface IOverlayProps {
  event?: string;
  isOpen?: boolean;
  onOpen?: () => void;
  onClose?: () => void;
  children: (handleOpen: () => void) => React.ReactNode;
  content: React.ComponentType;
  width?: number;
}

const POPOVER_WIDTH = 390;

const noop = () => undefined;
export const Overlay: React.FC<IOverlayProps> = ({
  event,
  isOpen,
  onOpen = noop,
  onClose = noop,
  children,
  content: Content,
  width = POPOVER_WIDTH,
}) => {
  const [open, setOpen] = useState(isOpen === undefined ? false : isOpen);
  const isControlled = isOpen !== undefined;
  const openState = isControlled ? isOpen : open;
  const element = React.useRef<HTMLDivElement>();
  const bounds = React.useRef<{
    top: number;
    left: number;
    height: number;
    width: number;
  }>({
    top: 0,
    left: 0,
    width: 0,
    height: 0,
  });

  const calculateBounds = () => {
    const posData = element.current.getBoundingClientRect();
    bounds.current = {
      top: posData.top,
      left: posData.left,
      width: posData.width,
      height: posData.height,
    };
  };

  useLayoutEffect(() => {
    calculateBounds();

    window.addEventListener('resize', calculateBounds);
    return () => {
      window.removeEventListener('resize', calculateBounds);
    };
  }, []);

  const handleClose = useCallback(() => {
    if (openState) {
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
  }, [openState, isControlled, onClose, setOpen, event]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (!e.defaultPrevented && e.keyCode === ESC) {
        handleClose();
      }
    };

    if (openState) {
      document.addEventListener('keydown', handleEscape);
    } else {
      document.removeEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [handleClose, openState]);

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
    <Container ref={element}>
      {children(handleOpen)}

      {openState && (
        <Portal>
          <ContentContainer onClick={handleClose}>
            <motion.div
              onClick={e => e.stopPropagation()}
              style={{
                opacity: 0.6,
                position: 'absolute',
                zIndex: 10,
                overflow: 'hidden',
                boxShadow:
                  '0px 4px 4px rgba(0,0,0,0.12), 0px 16px 32px rgba(0,0,0,0.24)',
                height: 'auto',
                borderRadius: 4,
                top: bounds.current.top + bounds.current.height + 8,
                left: bounds.current.left + bounds.current.width - width,
                width,
              }}
              transition={{
                duration: 0.2,
              }}
              initial={{ y: -5 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Content />
            </motion.div>
          </ContentContainer>
        </Portal>
      )}
    </Container>
  );
};
