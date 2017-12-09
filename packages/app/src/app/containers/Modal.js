import React from 'react';
import { connect } from 'react-redux';
import styled, { injectGlobal } from 'styled-components';
import { bindActionCreators } from 'redux';
import Modal from 'react-modal';
import type { Modal as ModalType } from 'common/types';

import { modalSelector } from 'app/store/modal/selectors';
import modalActionCreators from 'app/store/modal/actions';

const appElement = document.getElementById('modal');
Modal.setAppElement(appElement);

const CLOSE_TIMEOUT_MS = 300;

// eslint-disable-next-line
injectGlobal`
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

  .ReactModal__Body--open {
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

type Props = {
  modalActions: typeof modalActionCreators,
  modal: ModalType,
};

const BaseModal = styled.div`
  background-color: ${props => props.theme.background3};
`;

const ModalTitle = styled.h1`
  background-color: ${props => props.theme.secondary};
  color: white;
  padding: 1rem;
  margin: 0;
  font-size: 1.25rem;
  text-align: center;
  background-image: linear-gradient(-225deg, #31b0ff 0%, #47a8e5 100%);
`;

const ModalBody = styled.div`
  background-color: white;
  color: black;
`;

const mapStateToProps = state => ({
  modal: modalSelector(state),
});
const mapDispatchToProps = dispatch => ({
  modalActions: bindActionCreators(modalActionCreators, dispatch),
});
class ModalContainer extends React.PureComponent {
  props: Props;

  closeModal = e => {
    const { modalActions, modal } = this.props;
    if (e && e.keyCode && modal.preventEscapeClosing) {
      return;
    }

    modalActions.closeModal();
  };

  getStyles = (width = 400, top = 20) => ({
    overlay: {
      backgroundColor: 'rgba(0, 0, 0, 0.75)',
      overflowY: 'auto',
      zIndex: 30,
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
    const { modal } = this.props;

    return (
      <Modal
        isOpen={modal.open}
        onRequestClose={!modal.preventClosing && this.closeModal}
        contentLabel={modal.title || 'Modal'}
        style={this.getStyles(modal.width, modal.top)}
        closeTimeoutMS={CLOSE_TIMEOUT_MS}
      >
        {modal.open && (
          <BaseModal>
            {modal.title && <ModalTitle>{modal.title}</ModalTitle>}
            <ModalBody>{modal.Body}</ModalBody>
          </BaseModal>
        )}
      </Modal>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ModalContainer);
