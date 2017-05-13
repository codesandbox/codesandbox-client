// @flow
import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import usersActionCreators from 'app/store/entities/users/actions';

type Props = {
  usersActions: typeof usersActionCreators,
  username: string,
};

const mapDispatchToProps = dispatch => ({
  usersActions: bindActionCreators(usersActionCreators, dispatch),
});
class Sandboxes extends React.PureComponent {
  props: Props;

  componentDidMount() {
    const { usersActions, username, sandboxes } = this.props;
    if (!sandboxes) {
      usersActions.fetchAllSandboxes(username);
    }
  }
  render() {
    const { sandboxes } = this.props;
    if (!sandboxes) return <div />;
    return <div>{sandboxes.length}</div>;
  }
}

export default connect(undefined, mapDispatchToProps)(Sandboxes);
