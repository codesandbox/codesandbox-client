import React from 'react';
import Modal from 'react-modal';
import { createGlobalStyle } from 'styled-components';

import { CLOSE_TIMEOUT_MS, BaseModal, ModalTitle, ModalBody } from './elements';

if (document.getElementById('root')) {
  Modal.setAppElement('#root');
} else if (document.getElementById('___gatsby')) {
  Modal.setAppElement('#___gatsby');
}

const GlobalStyles = createGlobalStyle`
.ReactModal__Content {
  transition: all ${CLOSE_TIMEOUT_MS}ms ease;
  transition-property: opacity, transform;
  opacity: 0;
  transform: scale(0.9) translateY(5px);

  h2 {
    margin-top: 14px;
  }
}

.ReactModal__Overlay {
  transition: all ${CLOSE_TIMEOUT_MS}ms ease;
  transition-property: opacity, transform;
  z-index: 10;
  opacity: 0;
}

.ReactModal__Overlay--after-open {
  transition: all ${CLOSE_TIMEOUT_MS}ms ease;
  z-index: 10;
  opacity: 1;
}

.ReactModal__Html--open {
  overflow-y: hidden;
}

.ReactModal__Content--after-open {
  opacity: 1;
  transform: scale(1) translateY(0);
}

.ReactModal__Overlay--before-close {
  opacity: 0;
}

.ReactModal__Content--before-close {
  opacity: 0;
  transform: scale(0.9) translateY(0);
}
`;

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
      <React.Fragment>
        <GlobalStyles />
        <Modal
          isOpen={isOpen}
          onRequestClose={e => onClose(e.type === 'keydown')}
          contentLabel={title || 'Modal'}
          style={this.getStyles(width, top)}
          closeTimeoutMS={CLOSE_TIMEOUT_MS}
          htmlOpenClassName="ReactModal__Html--open"
          {...props}
        >
          <BaseModal>
            {title && <ModalTitle>{title}</ModalTitle>}
            <ModalBody>{children}</ModalBody>
          </BaseModal>
        </Modal>
      </React.Fragment>
    );
  }
}

export default ModalComponent;
