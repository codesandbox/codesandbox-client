import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import modalActionCreators from 'app/store/modal/actions';
import NewSandbox from 'app/components/sandbox/NewSandbox';

const mapDispatchToProps = dispatch => ({
  modalActions: bindActionCreators(modalActionCreators, dispatch),
});

export default connect(null, mapDispatchToProps)(NewSandbox);
