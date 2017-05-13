// @flow
import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import styled from 'styled-components';

import type { CurrentUser } from 'common/types';
import { currentUserSelector } from 'app/store/user/selectors';
import currentUserActionCreators from 'app/store/user/actions';
import modalActionCreators from 'app/store/modal/actions';
import usersActionCreators from 'app/store/entities/users/actions';

import Sandbox from './Sandbox';

const Padding = styled.div`
  padding: 1rem;
  text-align: center;
`;

type Props = {
  usersActions: typeof usersActionCreators,
  currentUserActions: typeof currentUserActionCreators,
  modalActions: typeof modalActionCreators,
  user: CurrentUser,
  showcaseSandboxId: string,
};

const mapStateToProps = state => ({
  user: currentUserSelector(state),
});
const mapDispatchToProps = dispatch => ({
  usersActions: bindActionCreators(usersActionCreators, dispatch),
  currentUserActions: bindActionCreators(currentUserActionCreators, dispatch),
  modalActions: bindActionCreators(modalActionCreators, dispatch),
});
class SelectSandbox extends React.PureComponent {
  props: Props;

  componentDidMount() {
    this.props.currentUserActions.loadUserSandboxes();
  }

  setShowcasedSandbox = (id: string) => {
    const { usersActions, modalActions, user } = this.props;

    usersActions.setShowcasedSandboxId(user.username, id);
    modalActions.closeModal();
  };

  render() {
    const { user, showcaseSandboxId } = this.props;

    if (user.sandboxes == null) return <Padding>Loading sandboxes...</Padding>;

    return (
      <div>
        {user.sandboxes
          .filter(x => x)
          .map(sandbox => (
            <Sandbox
              active={sandbox.id === showcaseSandboxId}
              key={sandbox.id}
              sandbox={sandbox}
              setShowcasedSandbox={this.setShowcasedSandbox}
            />
          ))}
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SelectSandbox);
