// @flow
import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { BrowserRouter, Match } from 'react-router';
import 'normalize.css';

import Header from '../components/Header';
import Modal from '../containers/Modal';
import Notifications from '../containers/Notifications';
import ContextMenu from '../containers/ContextMenu';
import Homepage from './Homepage';
import SandboxView from './SandboxView/';
import userActionCreators from '../store/actions/user';
import type { User } from '../store/reducers/user';

const Container = styled.div`
  display: flex;
  height: 100%;
  flex-direction: column;
  margin: 0;
`;

const Content = styled.div`
  flex: auto;
  display: flex;
  background-color: ${props => props.theme.background2};
`;

type Props = {
  userActions: typeof userActionCreators;
  user: User;
};

const mapStateToProps = state => ({
  user: state.user,
});
const mapDispatchToProps = dispatch => ({
  userActions: bindActionCreators(userActionCreators, dispatch),
});
class RootPage extends React.PureComponent {
  componentDidMount() {
    const { userActions } = this.props;
    userActions.getUser();
  }

  props: Props;

  render() {
    const { user } = this.props;
    return (
      <BrowserRouter>
        <Container>
          <Notifications />
          <ContextMenu />
          <Modal />
          <Header username={user.username} />
          <Content>
            <Match exactly pattern="/" component={Homepage} />
            <Match pattern="/:action" component={SandboxView} />
          </Content>
        </Container>
      </BrowserRouter>
    );
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(RootPage);
