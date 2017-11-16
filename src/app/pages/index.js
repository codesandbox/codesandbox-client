// @flow
import * as React from 'react';
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
import { loggedInSelector } from 'app/store/user/selectors';
import userActionCreators from 'app/store/user/actions';
import initializeConnectionManager from 'app/store/connection/actions';

import Sandbox from './Sandbox';
import NewSandbox from './NewSandbox';

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
  loader: () => import(/* webpackChunkName: 'page-sign-in' */ './SignIn'),
  LoadingComponent: Loading,
});
const ZeitSignIn = Loadable({
  loader: () => import(/* webpackChunkName: 'page-zeit' */ './auth/Zeit'),
  LoadingComponent: Loading,
});
const NotFound = Loadable({
  loader: () => import(/* webpackChunkName: 'page-not-found' */ './NotFound'),
  LoadingComponent: Loading,
});
const Profile = Loadable({
  loader: () => import(/* webpackChunkName: 'page-profile' */ './Profile'),
  LoadingComponent: Loading,
});
const Search = Loadable({
  loader: () => import(/* webpackChunkName: 'page-search' */ './Search'),
  LoadingComponent: Loading,
});
const CLI = Loadable({
  loader: () => import(/* webpackChunkName: 'page-cli' */ './CLI'),
  LoadingComponent: Loading,
});
const GitHub = Loadable({
  loader: () => import(/* webpackChunkName: 'page-github' */ './GitHub'),
  LoadingComponent: Loading,
});
const CliInstructions = Loadable({
  loader: () =>
    import(/* webpackChunkName: 'page-cli-instructions' */ './CliInstructions'),
  LoadingComponent: Loading,
});
const Patron = Loadable({
  loader: () => import(/* webpackChunkName: 'page-patron' */ './Patron'),
  LoadingComponent: Loading,
});
const Terms = Loadable({
  loader: () => import(/* webpackChunkName: 'page-terms' */ './Terms'),
  LoadingComponent: Loading,
});

type Props = {
  hasLogin: boolean,
  userActions: typeof userActionCreators,
  initializeConnectionManager: typeof initializeConnectionManager,
};

const mapStateToProps = createSelector(loggedInSelector, loggedIn => ({
  hasLogin: loggedIn,
}));
const mapDispatchToProps = dispatch => ({
  userActions: bindActionCreators(userActionCreators, dispatch),
  initializeConnectionManager: bindActionCreators(
    initializeConnectionManager,
    dispatch
  ),
});
class Routes extends React.PureComponent<Props> {
  unlisten: () => void;

  componentDidMount() {
    this.unlisten = this.props.initializeConnectionManager();

    if (this.props.hasLogin) {
      this.props.userActions.getCurrentUser();
    }
  }

  componentWillUnmount() {
    if (this.unlisten) this.unlisten();
  }

  render() {
    return (
      <Container>
        <Route
          path="/"
          render={({ location }) => {
            if (process.env.NODE_ENV === 'production') {
              routeDebugger(
                `Sending '${location.pathname + location.search}' to ga.`
              );
              if (typeof window.ga === 'function') {
                window.ga('set', 'page', location.pathname + location.search);
                window.ga('send', 'pageview');
              }
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
            <Route exact path="/s/cli" component={CliInstructions} />
            <Route exact path="/s" component={NewSandbox} />
            <Route path="/s/:id*" component={Sandbox} />
            <Route path="/signin/:jwt?" component={SignIn} />
            <Route path="/u/:username" component={Profile} />
            <Route path="/search" component={Search} />
            <Route path="/patron" component={Patron} />
            <Route path="/cli/login" component={CLI} />
            <Route path="/legal" component={Terms} />
            <Route path="/auth/zeit" component={ZeitSignIn} />
            <Route component={NotFound} />
          </Switch>
        </Content>
      </Container>
    );
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Routes));
