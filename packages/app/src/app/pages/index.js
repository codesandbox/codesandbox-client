// @flow
import * as React from 'react';
import { inject, observer } from 'mobx-react';
import Loadable from 'react-loadable';
import { Route, Switch, Redirect } from 'react-router-dom';

import _debug from 'app/utils/debug';
import Notifications from 'app/pages/common/Notifications';
import Loading from 'app/components/Loading';
import { DragDropContext } from 'react-dnd';

import send, { DNT } from 'common/utils/analytics';

import Modals from './common/Modals';
import Sandbox from './Sandbox';
import NewSandbox from './NewSandbox';
import Dashboard from './Dashboard';
import { Container, Content } from './elements';

import HTML5Backend from './common/HTML5BackendWithFolderSupport';

const routeDebugger = _debug('cs:app:router');

const SignIn = Loadable({
  loader: () =>
    import(/* webpackChunkName: 'page-sign-in' */ './common/SignIn'),
  LoadingComponent: Loading,
});
const Live = Loadable({
  loader: () => import(/* webpackChunkName: 'page-sign-in' */ './Live'),
  LoadingComponent: Loading,
});
const ZeitSignIn = Loadable({
  loader: () => import(/* webpackChunkName: 'page-zeit' */ './common/ZeitAuth'),
  LoadingComponent: Loading,
});
const NotFound = Loadable({
  loader: () =>
    import(/* webpackChunkName: 'page-not-found' */ './common/NotFound'),
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
  signals: any,
};

class Routes extends React.Component<Props> {
  componentWillUnmount() {
    this.props.signals.appUnmounted();
  }

  shouldComponentUpdate() {
    // Without this the app won't update on route changes, we've tried using
    // `withRouter`, but it caused the app to remount on every route change.
    return true;
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
              if (typeof window.ga === 'function' && !DNT) {
                window.ga('set', 'page', location.pathname + location.search);

                send('pageview', { path: location.pathname + location.search });
              }
            }
            return null;
          }}
        />
        <Notifications />
        <Content>
          <Switch>
            <Route exact path="/" render={() => <Redirect to="/s" />} />
            <Route exact path="/s/github" component={GitHub} />
            <Route exact path="/s/cli" component={CliInstructions} />
            <Route exact path="/s" component={NewSandbox} />
            <Route path="/dashboard" component={Dashboard} />
            <Route path="/s/:id*" component={Sandbox} />
            <Route path="/live/:id" component={Live} />
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
        <Modals />
      </Container>
    );
  }
}

export default inject('signals', 'store')(
  DragDropContext(HTML5Backend)(observer(Routes))
);
