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
  Loading,
} from './elements';
import { GitHubIcon } from '../Sandbox/Editor/Workspace/screens/GitHub/Icons';
import { Survey } from './Survey';

export const WaitListRequest = () => {
  const { hasLogIn, user, isAuthenticating, isLoadingGithub } = useAppState();
  const { sandboxPageMounted } = useActions();

  useEffect(() => {
    sandboxPageMounted();
  }, [sandboxPageMounted]);

  if (isAuthenticating || isLoadingGithub) {
    return <Loading />;
  }

  if (!hasLogIn || !user) {
    history.push(`/signin?continue=/waitlist&v2=true`);

    return null;
  }

  if (!user.integrations?.github?.email) {
    return <GitHubScope />;
  }

  if (user.betaAccess) {
    window.location.replace('/p/dashboard');

    return null;
  }

  return <Survey email={user.email} />;
};

/**
 * GitHub token request
 */
const GitHubScope: React.FC = () => {
  const { signInGithubClicked } = useActions();
  const { user } = useAppState();

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

        <Button type="button" onClick={signInGithubClicked}>
          <GitHubIcon css={{ width: 16, height: 16 }} />
          <span>Sign in to join</span>
        </Button>
      </Center>

      <TermsAndUsage />
    </Wrapper>
  );
};
