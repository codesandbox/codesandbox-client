import React from 'react';
import deepmerge from 'deepmerge';

import css from '@styled-system/css';
import { createGlobalStyle } from 'styled-components';
import { AnimatePresence, motion } from 'framer-motion';

import Rect, { useRect } from '@reach/rect';
import { DialogOverlay, DialogContent } from '@reach/dialog';
import '@reach/dialog/styles.css';

import { Button } from '../Button';
import { IconButton } from '../IconButton';

const GlobalStyle = createGlobalStyle(
  css({
    '[data-reach-dialog-overlay][data-component="DialogOverlay"]': {
      background: 'transparent',
    },
    '[data-reach-dialog-content][data-component="DialogContent"]': {
      backgroundColor: 'dialog.background',
      color: 'dialog.foreground',
      border: '1px solid',
      borderColor: 'dialog.border',
      borderRadius: 3,
      boxShadow: 2,
      position: 'absolute',
      // override reach styles
      padding: 0,
      margin: 0,
      width: 'auto',
    },
  })
);

const context = React.createContext({
  dialogVisible: false,
  setDialogVisibility: null,
  triggerRef: null,
  triggerRect: null,
  label: null,
});

type DialogTypes = React.FC<{
  /** Accessible label for dialog content */
  label: string;
}> & {
  Content: typeof DialogContent;
  Button: typeof DialogButton;
  IconButton: typeof DialogIconButton;
};

const Dialog: DialogTypes = ({ label, children }) => {
  const [dialogVisible, setDialogVisibility] = React.useState(false);
  const triggerRef = React.useRef();
  const triggerRect = useRect(triggerRef);

  return (
    <context.Provider
      value={{
        dialogVisible,
        setDialogVisibility,
        triggerRef,
        triggerRect,
        label,
      }}
    >
      <GlobalStyle />
      {children}
    </context.Provider>
  );
};

const DialogButton = props => {
  const { setDialogVisibility, triggerRef } = React.useContext(context);

  return (
    <Button
      {...props}
      css={deepmerge({ width: 'auto' }, props.css || {})}
      ref={triggerRef}
      onClick={() => setDialogVisibility(true)}
    />
  );
};

const DialogIconButton = props => {
  const { setDialogVisibility, triggerRef, label } = React.useContext(context);

  return (
    <IconButton
      {...props}
      title={props.label || label}
      css={deepmerge({ width: '26px' }, props.css || {})}
      innerRef={triggerRef}
      onClick={() => setDialogVisibility(true)}
    />
  );
};

const Content = ({ style = {}, children, ...props }) => {
  if (props.css)
    console.warn(`Dialog.Content: Please use style instead of css
    
    This component is rendered in a portal and is outside
    the scope of scope of design language.
  `);

  const {
    dialogVisible,
    setDialogVisibility,
    triggerRect,
    label,
  } = React.useContext(context);

  const [overlayVisible, setOverlayVisiblity] = React.useState(false);

  React.useEffect(() => {
    if (dialogVisible) setOverlayVisiblity(true);
  }, [dialogVisible]);

  return (
    <DialogOverlay
      isOpen={overlayVisible}
      onDismiss={() => setDialogVisibility(false)}
      data-component="DialogOverlay"
    >
      <Rect>
        {({ rect, ref }) => (
          <AnimatePresence onExitComplete={() => setOverlayVisiblity(false)}>
            {dialogVisible && (
              <motion.div
                initial={{ y: -4, scaleY: 0.98 }}
                animate={{ opacity: 1, y: 0, scaleY: 1 }}
                exit={{ y: -4, opacity: 0, transition: { duration: 0.1 } }}
                transition={{ duration: 0.25 }}
              >
                <DialogContent
                  data-component="DialogContent"
                  aria-label={label}
                  ref={ref}
                  style={{
                    ...centered(triggerRect, rect),
                    ...style,
                  }}
                  {...props}
                >
                  {children}
                </DialogContent>
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </Rect>
    </DialogOverlay>
  );
};

const centered = (triggerRect, dialogRect) => {
  if (!dialogRect || !triggerRect) return { left: 0, top: 0 };

  const triggerCenter = triggerRect.left + triggerRect.width / 2;
  const left = triggerCenter - dialogRect.width / 2;
  const maxLeft = window.innerWidth - dialogRect.width - 2;

  return {
    left: Math.min(Math.max(2, left), maxLeft) + window.scrollX,
    top: triggerRect.bottom + 8 + window.scrollY,
  };
};

/**
 * Attaching components to the parent for an easier API
 */
Dialog.Button = DialogButton;
Dialog.IconButton = DialogIconButton;
Dialog.Content = Content;

export { Dialog };
