import { Button } from '@codesandbox/common/lib/components/Button';
import theme from '@codesandbox/common/lib/theme';
import { DNT, trackPageview } from '@codesandbox/common/lib/utils/analytics';
import _debug from '@codesandbox/common/lib/utils/debug';
import { notificationState } from '@codesandbox/common/lib/utils/notifications';
import { NotificationStatus, Toasts } from '@codesandbox/notifications';
import { useOvermind } from 'app/overmind';
import Loadable from 'app/utils/Loadable';
import React, { useEffect } from 'react';
import { DragDropContext } from 'react-dnd';
import { Redirect, Route, Switch, withRouter } from 'react-router-dom';

import { ErrorBoundary } from './common/ErrorBoundary';
import HTML5Backend from './common/HTML5BackendWithFolderSupport';
import { Modals } from './common/Modals';
import Dashboard from './Dashboard';
import { DevAuthPage } from './DevAuth';
import { Container, Content } from './elements';
import { NewSandbox } from './NewSandbox';
import Sandbox from './Sandbox';

const routeDebugger = _debug('cs:app:router');

const SignInAuth = Loadable(() =>
  import(/* webpackChunkName: 'page-sign-in' */ './SignInAuth')
);
const SignIn = Loadable(() =>
  import(/* webpackChunkName: 'page-sign-in' */ './SignIn')
);
const Live = Loadable(() =>
  import(/* webpackChunkName: 'page-sign-in' */ './Live')
);
const ZeitSignIn = Loadable(() =>
  import(/* webpackChunkName: 'page-zeit' */ './ZeitAuth')
);
const PreviewAuth = Loadable(() =>
  import(/* webpackChunkName: 'page-zeit' */ './PreviewAuth')
);
const NotFound = Loadable(() =>
  import(/* webpackChunkName: 'page-not-found' */ './common/NotFound')
);
const Profile = Loadable(() =>
  import(/* webpackChunkName: 'page-profile' */ './Profile').then(module => ({
    default: module.Profile,
  }))
);
const Search = Loadable(() =>
  import(/* webpackChunkName: 'page-search' */ './Search').then(module => ({
    default: module.Search,
  }))
);
const CLI = Loadable(() => import(/* webpackChunkName: 'page-cli' */ './CLI'));

const GitHub = Loadable(() =>
  import(/* webpackChunkName: 'page-github' */ './GitHub').then(module => ({
    default: module.GitHub,
  }))
);
const CliInstructions = Loadable(() =>
  import(
    /* webpackChunkName: 'page-cli-instructions' */ './CliInstructions'
  ).then(module => ({ default: module.CLIInstructions }))
);
const Patron = Loadable(() =>
  import(/* webpackChunkName: 'page-patron' */ './Patron')
);
const Curator = Loadable(() =>
  import(/* webpackChunkName: 'page-curator' */ './Curator')
);
const CodeSadbox = () => this[`💥`].kaboom();

const Boundary = withRouter(ErrorBoundary);

const RoutesComponent: React.FC = () => {
  const {
    actions: { appUnmounted },
  } = useOvermind();
  useEffect(() => () => appUnmounted(), [appUnmounted]);

  return (
    <Container>
      <Route
        path="/"
        render={({ location }) => {
          if (process.env.NODE_ENV === 'production') {
            routeDebugger(
              `Sending '${location.pathname + location.search}' to analytics.`
            );
            if (!DNT) {
              trackPageview();
            }
          }
          return null;
        }}
      />
      <Toasts
        colors={{
          [NotificationStatus.ERROR]: theme.dangerBackground(),
          [NotificationStatus.SUCCESS]: theme.green(),
          [NotificationStatus.NOTICE]: theme.secondary(),
          [NotificationStatus.WARNING]: theme.primary(),
        }}
        state={notificationState}
        Button={Button}
      />
      <Boundary>
        <Content>
          <Switch>
            <Route exact path="/" render={() => <Redirect to="/s" />} />
            <Route exact path="/s/github" component={GitHub} />
            <Route exact path="/s/cli" component={CliInstructions} />
            <Route exact path="/s" component={NewSandbox} />
            <Route path="/dashboard" component={Dashboard} />
            <Route path="/curator" component={Curator} />
            <Route path="/s/:id*" component={Sandbox} />
            <Route path="/live/:id" component={Live} />
            <Route path="/signin" exact component={SignIn} />
            <Route path="/signin/:jwt?" component={SignInAuth} />
            <Route path="/u/:username" component={Profile} />
            <Route path="/search" component={Search} />
            <Route path="/patron" component={Patron} />
            <Route path="/cli/login" component={CLI} />
            <Route path="/auth/zeit" component={ZeitSignIn} />
            <Route path="/auth/sandbox/:id" component={PreviewAuth} />
            {(process.env.LOCAL_SERVER || process.env.STAGING) && (
              <Route path="/auth/dev" component={DevAuthPage} />
            )}
            {process.env.NODE_ENV === `development` && (
              <Route path="/codesadbox" component={CodeSadbox} />
            )}
            <Route component={NotFound} />
          </Switch>
        </Content>
      </Boundary>
      <Modals />
    </Container>
  );
};

export const Routes = DragDropContext(HTML5Backend)(
  withRouter(RoutesComponent)
);
