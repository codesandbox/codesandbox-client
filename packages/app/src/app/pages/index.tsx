import { DNT, trackPageview } from '@codesandbox/common/lib/utils/analytics';
import _debug from '@codesandbox/common/lib/utils/debug';
import { notificationState } from '@codesandbox/common/lib/utils/notifications';
import { Toasts } from '@codesandbox/notifications';
import { useAppState, useActions } from 'app/overmind';
import { Loadable } from 'app/utils/Loadable';
import React, { useEffect } from 'react';
import { SignInModal } from 'app/components/SignInModal';
import { Redirect, Route, Switch, withRouter } from 'react-router-dom';
import { Debug } from 'app/components/Debug';
import { useCookieConsent } from '../hooks/useCookieConsent';
import { ErrorBoundary } from './common/ErrorBoundary';
import { Modals } from './common/Modals';
import { DevAuthPage } from './DevAuth';
import { StandalonePage } from './Standalone';
import { CreateWorkspace, UpgradeWorkspace } from './WorkspaceFlows';
import { Container, Content } from './elements';
import { Dashboard } from './Dashboard';
import { Sandbox } from './Sandbox';

const MoveSandboxFolderModal = Loadable(() =>
  import(
    /* webpackChunkName: 'move-sandbox-modal' */ './common/Modals/MoveSandboxFolderModal'
  ).then(module => ({
    default: module.MoveSandboxFolderModal,
  }))
);

const DuplicateAccount = Loadable(() =>
  import(
    /* webpackChunkName: 'move-sandbox-modal' */ './DuplicateAccount'
  ).then(module => ({
    default: module.DuplicateAccount,
  }))
);

const routeDebugger = _debug('cs:app:router');

const SignInAuth = Loadable(
  () => import(/* webpackChunkName: 'page-sign-in' */ './SignInAuth')
);
const SignIn = Loadable(() =>
  import(/* webpackChunkName: 'page-sign-in' */ './SignIn').then(module => ({
    default: module.SignInPage,
  }))
);
const SignOut = Loadable(() =>
  import(/* webpackChunkName: 'page-sign-out' */ './SignOut').then(module => ({
    default: module.SignOut,
  }))
);
const PreviewAuth = Loadable(
  () => import(/* webpackChunkName: 'page-vercel' */ './PreviewAuth')
);
const SandpackSecret = Loadable(
  () => import(/* webpackChunkName: 'page-vercel' */ './SandpackSecret')
);
const NotFound = Loadable(() =>
  import(/* webpackChunkName: 'page-not-found' */ './common/NotFound').then(
    module => ({
      default: module.NotFound,
    })
  )
);
const Phew = Loadable(() =>
  import(/* webpackChunkName: 'phishing-phew' */ './common/Phew').then(
    module => ({
      default: module.Phew,
    })
  )
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
const CLI = Loadable(() =>
  import(/* webpackChunkName: 'page-cli' */ './CLI').then(module => ({
    default: module.CLI,
  }))
);

const MobileAuth = Loadable(() =>
  import(/* webpackChunkName: 'page-mobile-auth' */ './MobileAuth').then(
    module => ({
      default: module.MobileAuth,
    })
  )
);

const VSCodeAuth = Loadable(() =>
  import(/* webpackChunkName: 'page-client' */ './VSCodeAuth').then(module => ({
    default: module.VSCodeAuth,
  }))
);

const TeamInvitation = Loadable(() =>
  import(
    /* webpackChunkName: 'page-team-invitation' */ './TeamInvitation'
  ).then(module => ({
    default: module.TeamInvitation,
  }))
);

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
const SignUp = Loadable(() =>
  import(/* webpackChunkName: 'page-signup' */ './SignUp').then(module => ({
    default: module.SignUp,
  }))
);

// @ts-ignore
const CodeSadbox = () => this[`💥`].kaboom();

const Boundary = withRouter(ErrorBoundary);

const RoutesComponent: React.FC = () => {
  const { appUnmounted } = useActions();
  const { modals, activeTeamInfo, environment } = useAppState();
  useCookieConsent(environment.amplitudeKey);

  useEffect(() => () => appUnmounted(), [appUnmounted]);

  return (
    <Container>
      <Route
        path="/"
        render={({ location, history }) => {
          if (
            process.env.NODE_ENV === 'production' &&
            history.action !== 'REPLACE'
          ) {
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
      <Toasts state={notificationState} />
      <Boundary>
        <Content>
          <Switch>
            <Route exact path="/" render={() => <Redirect to="/dashboard" />} />
            <Route exact path="/s/github" component={GitHub} />
            <Route exact path="/s/cli" component={CliInstructions} />
            <Route
              exact
              path="/s"
              component={() => <Sandbox showModalOnTop="newSandbox" />}
            />
            <Route
              exact
              path="/d"
              component={() => <Sandbox showModalOnTop="newDevbox" />}
            />
            <Route
              exact
              path="/new"
              component={() => <Sandbox showModalOnTop="new" />}
            />
            <Route path="/s/:id*" component={Sandbox} />
            <Route path="/invite/:token" component={TeamInvitation} />

            <Route path="/phew" component={Phew} />
            <Route path="/dashboard" component={Dashboard} />
            <Route path="/signin" exact component={SignIn} />
            <Route path="/signout" exact component={SignOut} />
            <Route path="/signin/duplicate" component={DuplicateAccount} />
            <Route path="/signup/:userId" exact component={SignUp} />
            <Route path="/signin/:jwt?" component={SignInAuth} />
            <Route path="/u/:username" component={Profile} />
            <Route path="/u2/:username" component={Profile} />
            <Route path="/search" component={Search} />

            <Route path="/cli/login" component={CLI} />
            <Route path="/client/login" component={MobileAuth} />
            <Route path="/vscode/login" component={VSCodeAuth} />
            <Route path="/auth/sandbox/:id" component={PreviewAuth} />
            <Route path="/auth/sandpack/:teamId" component={SandpackSecret} />
            {(process.env.LOCAL_SERVER || process.env.STAGING) && (
              <Route path="/auth/dev" component={DevAuthPage} />
            )}
            <Route path="/codesadbox" component={CodeSadbox} />
            <Route path="/standalone/:componentId" component={StandalonePage} />
            <Route path="/create-workspace" component={CreateWorkspace} />
            <Route path="/upgrade" component={UpgradeWorkspace} />
            <Route path="/manage-subscription" component={UpgradeWorkspace} />

            {environment.isOnPrem ? (
              <Redirect from="/pro" to="/dashboard" />
            ) : (
              <Redirect from="/pro" to="/upgrade" />
            )}

            <Route component={NotFound} />
          </Switch>
        </Content>
        <Modals />
        <SignInModal />
        {modals.moveSandboxModal.isCurrent && activeTeamInfo && (
          <MoveSandboxFolderModal />
        )}
        <Debug />
      </Boundary>
    </Container>
  );
};

export const Routes = withRouter(RoutesComponent);
