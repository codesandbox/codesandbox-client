// @flow
import * as React from 'react';
import { inject, observer } from 'mobx-react';
import Loadable from 'app/utils/Loadable';
import { Route, Switch, Redirect, withRouter } from 'react-router-dom';

import _debug from '@codesandbox/common/lib/utils/debug';
import { Notifications } from 'app/pages/common/Notifications';
import { DragDropContext } from 'react-dnd';

import { Toasts, NotificationState } from '@codesandbox/notifications';

import send, { DNT } from '@codesandbox/common/lib/utils/analytics';

import Modals from './common/Modals';
import Sandbox from './Sandbox';
import NewSandbox from './NewSandbox';
import Dashboard from './Dashboard';
import { Container, Content } from './elements';

import HTML5Backend from './common/HTML5BackendWithFolderSupport';
import { NotificationStatus } from '../../../../notifications/lib/state';

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

type Props = {
  signals: any,
};

const notifState = new NotificationState();

const messages = [
  "This is a test notification message, you've been notified.",
  'The TypeScript service has been reloaded',
  'Successfully joined the team!',
  'Forked Sandbox!',
  'There are multiple formatters for JSON-files. Select a default formatter to continue.',
];

setInterval(() => {
  notifState.addNotification({
    title: 'Dependency not found',
    message: messages[Math.floor(messages.length * Math.random())],
    status: Math.floor(Math.random() * 4),
    actions:
      Math.random() > 0.5
        ? [
            {
              primary: {
                title: 'Install Dependency',
                run: () => alert('test'),
              },
              secondary: {
                title: 'Close',
                run: () => alert('World'),
              },
            },
          ]
        : undefined,
  });
}, 3000);

class Routes extends React.Component<Props> {
  componentWillUnmount() {
    this.props.signals.appUnmounted();
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
        {/* <Notifications /> */}
        <Toasts state={notifState} />
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
            <Route component={NotFound} />
          </Switch>
        </Content>
        <Modals />
      </Container>
    );
  }
}

export default inject('signals', 'store')(
  DragDropContext(HTML5Backend)(withRouter(observer(Routes)))
);
