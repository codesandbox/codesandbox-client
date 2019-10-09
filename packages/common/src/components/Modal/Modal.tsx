import React from 'react';
import {
  useDialogState,
  DialogDisclosure,
  DialogBackdrop,
  Dialog,
} from 'reakit/Dialog';
import { Portal } from 'reakit/Portal';
import { Button, IButtonProps } from '../Button';
import { Backdrop, Container } from './elements';

export interface IModalProps extends IButtonProps {
  name: string;
  button?: React.ElementType;
  backdrop?: React.ElementType;
  container?: React.ElementType;
  defaultOpen?: boolean;
  children: ({
    open: boolean,
    toggleOpen: Function,
  }) => React.ReactNode | React.ReactNode;
}

export const Modal: React.FC<IModalProps> = ({
  name,
  button = Button,
  backdrop = Backdrop,
  container = Container,
  defaultOpen = false,
  children,
  ...props
}) => {
  const dialog = useDialogState({ visible: defaultOpen });

  return (
    <>
      <DialogDisclosure block as={button} {...dialog} {...props}>
        {name}
      </DialogDisclosure>
      <Portal>
        <DialogBackdrop {...dialog} as={backdrop}>
          <Dialog {...dialog} as={container} aria-label={name} modal={false}>
            {typeof children === `function`
              ? children({ open: dialog.visible, toggleOpen: dialog.toggle })
              : children}
          </Dialog>
        </DialogBackdrop>
      </Portal>
    </>
  );
};
