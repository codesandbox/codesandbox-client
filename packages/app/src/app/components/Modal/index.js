import React from 'react';
import Modal from 'react-modal';

import {
  CLOSE_TIMEOUT_MS,
  applyGlobalStyles,
  BaseModal,
  ModalTitle,
  ModalBody,
} from './elements';

Modal.setAppElement('#root');

applyGlobalStyles();

class ModalComponent extends React.Component {
  getStyles = (width = 400, top = 20) => ({
    overlay: {
      backgroundColor: 'rgba(0, 0, 0, 0.75)',
      overflowY: 'auto',
      zIndex: 30,
      transform: 'translate3d(0, 0, 0)',
    },
    content: {
      position: 'relative',
      overflow: 'hidden',
      padding: 0,
      maxWidth: width,
      top: `${top}vh`,
      bottom: 40,
      left: 0,
      right: 0,
      margin: `0 auto ${top}vh`,
      border: 'none',
      borderRadius: '4px',
    },
  });

  render() {
    const {
      isOpen,
      width,
      top,
      onClose,
      children,
      title,
      ...props
    } = this.props;

    return (
      <Modal
        isOpen={isOpen}
        onRequestClose={e => onClose(e.type === 'keydown')}
        contentLabel={title || 'Modal'}
        style={this.getStyles(width, top)}
        closeTimeoutMS={CLOSE_TIMEOUT_MS}
        {...props}
      >
        {isOpen ? (
          <BaseModal>
            {title && <ModalTitle>{title}</ModalTitle>}
            <ModalBody>{children}</ModalBody>
          </BaseModal>
        ) : null}
      </Modal>
    );
  }
}

export default ModalComponent;
