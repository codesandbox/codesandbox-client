import React, { useEffect } from 'react';

import { useAppState, useActions } from 'app/overmind';
import history from 'app/utils/history';

import {
  Avatar,
  Button,
  Center,
  MainTitle,
  Paragraph,
  SubTitle,
  Wrapper,
  TermsAndUsage,
  ExternalLink,
} from './elements';
import { GitHubIcon } from '../Sandbox/Editor/Workspace/screens/GitHub/Icons';
import { Survey } from './Survey';

export const WaitListRequest = () => {
  const { hasLogIn, user, dashboard, isAuthenticating } = useAppState();
  const { sandboxPageMounted } = useActions();

  useEffect(() => {
    sandboxPageMounted();
  }, [sandboxPageMounted]);

  if (isAuthenticating) {
    return (
      <Wrapper>
        <Center>
          <Paragraph>Loading...</Paragraph>
        </Center>
      </Wrapper>
    );
  }

  if (!hasLogIn || !user) {
    return <SignIn />;
  }

  return <Survey />;

  if (!user.integrations?.github?.email) {
    return <GitHubScope />;
  }

  const isFeatureFlagBeta = !!dashboard.featureFlags.find(
    e => e.name === 'beta'
  );
  if (isFeatureFlagBeta) {
    // TODO: temp dashboard URL
    history.replace('/dashboard/beta');
    return null;
  }

  return <SuccessStep />;
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
    <Wrapper>
      <Center>
        <svg
          width="50"
          height="50"
          viewBox="0 0 50 50"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ marginBottom: 40 }}
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M0 50H50V0H0V50ZM44.8864 44.8864V5.11364H5.11364V44.8864H44.8864Z"
            fill="white"
          />
        </svg>

        <MainTitle>Join the waitlist</MainTitle>

        <Paragraph>
          Access is limited to a small group of testers during the Beta of
          CodeSandbox Projects.
        </Paragraph>

        <Button type="button" onClick={handleSignIn}>
          <GitHubIcon css={{ width: 16, height: 16 }} />
          <span>Sign in to join</span>
        </Button>
      </Center>

      <TermsAndUsage />
    </Wrapper>
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
    <Wrapper>
      <Center>
        <Avatar src={user.avatarUrl} alt={user.name} />
        <SubTitle>Hey {user.name},</SubTitle>
        <MainTitle>Renew your permission to have access to Projects</MainTitle>
        <Paragraph>
          Access is limited to a small group of testers during the Beta of
          CodeSandbox Projects.{' '}
        </Paragraph>

        <Button type="button" onClick={handleSignIn}>
          <GitHubIcon css={{ width: 16, height: 16 }} />
          <span>Sign in to join</span>
        </Button>
      </Center>

      <TermsAndUsage />
    </Wrapper>
  );
};

/**
 * Success after submitting
 */
const SuccessStep = () => {
  return (
    <Wrapper>
      <Center>
        <svg
          width="50"
          height="37"
          viewBox="0 0 50 37"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ marginBottom: 40 }}
        >
          <path d="M2.5 16L18.5 32L47.5 3" stroke="white" strokeWidth="7" />
        </svg>

        <MainTitle>
          Yuppp! <br /> You are on the waitlist
        </MainTitle>
        <Paragraph>
          Stay tuned and see all the news from CodeSandbox on Twitter.
        </Paragraph>
        <ExternalLink
          target="_blank"
          rel="noreferrer"
          href="https://twitter.com/codesandbox"
        >
          Ok, thanks!
        </ExternalLink>
      </Center>

      <TermsAndUsage />
    </Wrapper>
  );
};
