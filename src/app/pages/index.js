// @flow
import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { BrowserRouter, Match, Miss, Redirect } from 'react-router';
import 'normalize.css';

import Header from '../components/Header';
import Modal from '../containers/Modal';
import Notifications from '../containers/Notifications';
import Root from './Root';
import SandboxEditor from './SandboxEditor/';
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
          <Modal />
          <Header username={user.username} />
          <Content>
            <Match exactly pattern="/" component={Root} />
            <Match
              pattern="/:username/:id" exactly render={props => (
                <Redirect to={`${props.location.pathname}/module`} />
              )}
            />
            <Match
              pattern="/:username/:slug/module/:module*"
              render={patternMatch => (
                <Content>
                  <Match pattern="/sandbox/:id/module/:module*" component={SandboxEditor} />
                  <Miss render={() => <SandboxEditor {...patternMatch} />} />
                </Content>
              )}
            />
          </Content>
        </Container>
      </BrowserRouter>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(RootPage);
