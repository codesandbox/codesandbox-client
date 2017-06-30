// @flow
import React from 'react';
import styled from 'styled-components';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Loadable from 'react-loadable';
import { Route, Switch, Redirect, withRouter } from 'react-router-dom';
import { createSelector } from 'reselect';

import _debug from 'app/utils/debug';
import Notifications from 'app/containers/Notifications';
import ContextMenu from 'app/containers/ContextMenu';
import Modal from 'app/containers/Modal';
import Loading from 'app/components/Loading';
import { jwtSelector } from 'app/store/user/selectors';
import userActionCreators from 'app/store/user/actions';

const routeDebugger = _debug('cs:app:router');

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

const SignIn = Loadable({
  loader: () => import('./SignIn'),
  LoadingComponent: Loading,
});
const NotFound = Loadable({
  loader: () => import('./NotFound'),
  LoadingComponent: Loading,
});
const Sandbox = Loadable({
  loader: () => import('./Sandbox'),
  LoadingComponent: Loading,
});
const Profile = Loadable({
  loader: () => import('./Profile'),
  LoadingComponent: Loading,
});
const CLI = Loadable({
  loader: () => import('./CLI'),
  LoadingComponent: Loading,
});
const GitHub = Loadable({
  loader: () => import('./GitHub'),
  LoadingComponent: Loading,
});

type Props = {
  hasLogin: boolean,
  userActions: typeof userActionCreators,
};

const mapStateToProps = createSelector(jwtSelector, jwt => ({
  hasLogin: !!jwt,
}));
const mapDispatchToProps = dispatch => ({
  userActions: bindActionCreators(userActionCreators, dispatch),
});
class Routes extends React.PureComponent {
  props: Props;

  componentDidMount() {
    if (this.props.hasLogin) {
      this.props.userActions.getCurrentUser();
    }
  }

  render() {
    return (
      <Container>
        <Route
          path="/"
          render={({ location }) => {
            routeDebugger(
              `Sending '${location.pathname + location.search}' to ga.`,
            );
            if (typeof window.ga === 'function') {
              window.ga('set', 'page', location.pathname + location.search);
              window.ga('send', 'pageview');
            }
            return null;
          }}
        />
        <Modal />
        <Notifications />
        <ContextMenu />
        <Content>
          <Switch>
            <Route exact path="/" render={() => <Redirect to="/s/new" />} />
            <Route exact path="/s/github" component={GitHub} />
            <Route path="/s/:id*" component={Sandbox} />
            <Route path="/signin/:jwt?" component={SignIn} />
            <Route path="/u/:username" component={Profile} />
            <Route path="/cli/login" component={CLI} />
            <Route component={NotFound} />
          </Switch>
        </Content>
      </Container>
    );
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Routes));
