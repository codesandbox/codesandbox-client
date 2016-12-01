import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import ReactModal from 'react-modal';

import type { ModalState } from '../../store/reducers/modal';
import modalActions from '../../store/actions/modal';
import theme from '../../../common/theme';

import './styles.css';

export const CLOSE_TIMEOUT_MS = 300;

type Props = {
  actions: typeof modalActions;
  modal: ModalState;
};

const MODAL_STYLES = {
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    overflowY: 'auto',
    zIndex: 20,
  },
  content: {
    position: 'relative',
    overflow: 'hidden',
    padding: 0,
    maxWidth: 400,
    top: '10vh',
    bottom: 40,
    left: 0,
    right: 0,
    margin: '0 auto 10vh',
    border: 'none',
    backgroundColor: theme.background2(),
    borderRadius: 0,
  },
};

const mapStateToProps = state => ({
  modal: state.modal,
});
const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(modalActions, dispatch),
});
class Modal extends React.PureComponent {
  props: Props;

  handleKeyPress = (event) => {
    if (event.keyCode === 8 && this.props.modal.show) {
      event.preventDefault();
      this.props.actions.closeModal();
    }
  };

  closeModal = (event) => {
    if (!this.template) return false;
    if (this.template.preventClose) return false;
    const { modal, actions: { closeModal } } = this.props;
    if (event) event.preventDefault();
    closeModal();
    if (modal.params.close) modal.params.close();
    return true;
  };

  render() {
    const { modal } = this.props;
    if (!modal.template) return null;

    this.template = require(`./modals/${modal.template}`); // eslint-disable-line

    const { default: Element, disableNaturalCancel } = this.template;

    const params = {
      ...modal.params,
      close: this.closeModal,
    };

    return (
      <ReactModal
        isOpen={modal.show}
        onRequestClose={disableNaturalCancel ? null : this.closeModal}
        closeTimeoutMS={CLOSE_TIMEOUT_MS}
        style={MODAL_STYLES}
      >
        <Element {...params} />
      </ReactModal>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Modal);
