import React, { ComponentProps } from 'react';
import {
  useDialogState,
  DialogDisclosure,
  DialogBackdrop,
  Dialog,
} from 'reakit/Dialog';
import { Portal } from 'reakit/Portal';
import { Button } from '../Button';
import { Backdrop, Container } from './elements';

export interface IModalProps extends ComponentProps<typeof Button> {
  label?: string;
  button?: React.ElementType;
  backdrop?: React.ElementType;
  container?: React.ElementType;
  isOpen?: boolean;
  onClose?: () => void;
  children:
    | (({ open: boolean, toggleOpen: Function }) => React.ReactNode)
    | React.ReactNode;
}

export const Modal: React.FC<IModalProps> = ({
  label,
  button = Button,
  backdrop = Backdrop,
  container = Container,
  isOpen,
  onClose = () => undefined,
  children,
  ...props
}) => {
  const dialog = useDialogState();
  const onHide = () => {
    dialog.hide();
    onClose();
  };

  return (
    <>
      {label && (
        <DialogDisclosure block as={button} {...dialog} {...props}>
          {label}
        </DialogDisclosure>
      )}
      <Portal>
        <DialogBackdrop {...dialog} as={backdrop}>
          <Dialog
            {...dialog}
            as={container}
            aria-label={name}
            modal={false}
            visible={typeof isOpen !== 'undefined' ? isOpen : dialog.visible}
            hide={onHide}
          >
            {typeof children === `function`
              ? (children as Function)({
                  open: dialog.visible,
                  toggleOpen: dialog.toggle,
                })
              : children}
          </Dialog>
        </DialogBackdrop>
      </Portal>
    </>
  );
};
