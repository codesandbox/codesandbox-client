import React from 'react';
import ReactModal from 'react-modal';
import { GlobalStyles } from './GlobalStyles';
import { CLOSE_TIMEOUT_MS } from './constants';
import { getStyles, BaseModal, ModalTitle, ModalBody } from './elements';

if (document.getElementById('root')) {
  ReactModal.setAppElement('#root');
} else if (document.getElementById('___gatsby')) {
  ReactModal.setAppElement('#___gatsby');
}

export const Modal = ({
  isOpen,
  width,
  top,
  onClose,
  children,
  title,
  ...props
}) => (
  <>
    <GlobalStyles />
    <ReactModal
      isOpen={isOpen}
      onRequestClose={e => onClose(e.type === 'keydown')}
      contentLabel={title || 'Modal'}
      style={getStyles(width, top)}
      closeTimeoutMS={CLOSE_TIMEOUT_MS}
      htmlOpenClassName="ReactModal__Html--open"
      {...props}
    >
      <BaseModal>
        {title && <ModalTitle>{title}</ModalTitle>}
        <ModalBody>{children}</ModalBody>
      </BaseModal>
    </ReactModal>
  </>
);
