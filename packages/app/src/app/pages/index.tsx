import React, { useEffect } from 'react';
import { Route, Switch, Redirect, withRouter } from 'react-router-dom';
import { DragDropContext } from 'react-dnd';
import _debug from '@codesandbox/common/lib/utils/debug';
import { Toasts, NotificationStatus } from '@codesandbox/notifications';
import { notificationState } from '@codesandbox/common/lib/utils/notifications';
import send, { DNT } from '@codesandbox/common/lib/utils/analytics';
import theme from '@codesandbox/common/lib/theme';
import { Button } from '@codesandbox/common/lib/components/Button';
import Loadable from 'app/utils/Loadable';
import { useOvermind } from 'app/overmind';
import { ErrorBoundary } from './common/ErrorBoundary';
import HTML5Backend from './common/HTML5BackendWithFolderSupport';
import Modals from './common/Modals';
import Sandbox from './Sandbox';
import NewSandbox from './NewSandbox';
import Dashboard from './Dashboard';
import { DevAuthPage } from './DevAuth';
import { Container, Content } from './elements';

const routeDebugger = _debug('cs:app:router');

const SignIn = Loadable(() =>
  import(/* webpackChunkName: 'page-sign-in' */ './common/SignIn')
);
const Live = Loadable(() =>
  import(/* webpackChunkName: 'page-sign-in' */ './Live')
);
const ZeitSignIn = Loadable(() =>
  import(/* webpackChunkName: 'page-zeit' */ './common/ZeitAuth')
);
const NotFound = Loadable(() =>
  import(/* webpackChunkName: 'page-not-found' */ './common/NotFound')
);
const Profile = Loadable(() =>
  import(/* webpackChunkName: 'page-profile' */ './Profile')
);
const Search = Loadable(() =>
  import(/* webpackChunkName: 'page-search' */ './Search')
);
const CLI = Loadable(() => import(/* webpackChunkName: 'page-cli' */ './CLI'));

const GitHub = Loadable(() =>
  import(/* webpackChunkName: 'page-github' */ './GitHub')
);
const CliInstructions = Loadable(() =>
  import(/* webpackChunkName: 'page-cli-instructions' */ './CliInstructions')
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
              `Sending '${location.pathname + location.search}' to ga.`
            );
            if (typeof (window as any).ga === 'function' && !DNT) {
              (window as any).ga(
                'set',
                'page',
                location.pathname + location.search
              );

              send('pageview', { path: location.pathname + location.search });
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
            <Route path="/signin" exact component={Dashboard} />
            <Route path="/signin/:jwt?" component={SignIn} />
            <Route path="/u/:username" component={Profile} />
            <Route path="/search" component={Search} />
            <Route path="/patron" component={Patron} />
            <Route path="/cli/login" component={CLI} />
            <Route path="/auth/zeit" component={ZeitSignIn} />
            {process.env.NODE_ENV === `development` && (
              <>
                <Route path="/auth/dev" component={DevAuthPage} />
                <Route path="/codesadbox" component={CodeSadbox} />
              </>
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
