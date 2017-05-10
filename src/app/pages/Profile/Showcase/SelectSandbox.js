// @flow
import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import styled from 'styled-components';

import type { CurrentUser } from 'common/types';
import { currentUserSelector } from 'app/store/user/selectors';
import userActionCreators from 'app/store/user/actions';

const Padding = styled.div`
  padding: 1rem;
`;

const Button = styled.button`
  transition: 0.3s ease all;
  width: 100%;
  height: 100%;
  outline: none;
  border: none;
  background-color: white;
  padding: 1rem;
  border-bottom: 1px solid #ddd;
  text-align: left;

  &:hover {
    background-color: #ddd;
  }
`;

type Props = {
  userActions: typeof userActionCreators,
  user: CurrentUser,
};

const mapStateToProps = state => ({
  user: currentUserSelector(state),
});
const mapDispatchToProps = dispatch => ({
  userActions: bindActionCreators(userActionCreators, dispatch),
});
class SelectSandbox extends React.PureComponent {
  props: Props;

  componentDidMount() {
    this.props.userActions.loadUserSandboxes();
  }

  render() {
    const { user } = this.props;

    if (user.sandboxes == null) return <Padding>Loading sandboxes...</Padding>;

    return (
      <div>
        {user.sandboxes
          .filter(x => x)
          .map(sandbox => <Button key={sandbox.id}>{sandbox.title}</Button>)}
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SelectSandbox);
