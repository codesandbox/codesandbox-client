import React, { useEffect } from 'react';

import { useAppState, useActions } from 'app/overmind';
import { Redirect } from 'react-router-dom';

export const WaitListRequest = () => {
  const { hasLogIn, user, dashboard } = useAppState();
  const { sandboxPageMounted } = useActions();

  useEffect(() => {
    sandboxPageMounted();
  }, [sandboxPageMounted]);

  if (!hasLogIn) {
    return <SignIn />;
  }

  if (!user?.integrations?.github?.email) {
    return <GitHubScope />;
  }

  const isFeatureFlagBeta = !!dashboard.featureFlags.find(
    e => e.name === 'beta'
  );

  if (isFeatureFlagBeta) {
    // TOOD: temp dashboard URL
    return <Redirect to="/dashboard/beta" />;
  }

  return <Redirect to="/waitlist/success" />;
};

/**
 * Sign in page: GitHub scope
 */
const SignIn: React.FC = () => {
  const { signInButtonClicked } = useActions();

  const handleSignIn = async () => {
    await signInButtonClicked({ provider: 'github', useExtraScopes: false });
  };

  return (
    <div>
      <h1>Join the waitlist</h1>

      <p>
        Access is limited to a small group of testers during the Beta of
        CodeSandbox Projects.
      </p>

      <button type="button" onClick={handleSignIn}>
        Sign in to join
      </button>

      <p>
        By clicking Sign in, you agree to CodeSandbox Terms of Service, Privacy
        Policy
      </p>
    </div>
  );
};

/**
 * GitHub token request
 */
const GitHubScope: React.FC = () => {
  const { signInButtonClicked } = useActions();
  const { user } = useAppState();

  const handleSignIn = async () => {
    await signInButtonClicked({ provider: 'github', useExtraScopes: false });
  };

  return (
    <div>
      <img src={user.avatarUrl} alt={user.name} />
      <h1>Hey {user.name},</h1>
      <p>Renew your permission to have access to Projects</p>
      <p>
        Access is limited to a small group of testers during the Beta of
        CodeSandbox Projects.{' '}
      </p>

      <button type="button" onClick={handleSignIn}>
        Sign in to join
      </button>

      <p>
        By clicking Sign in, you agree to CodeSandbox Terms of Service, Privacy
        Policy
      </p>
    </div>
  );
};
