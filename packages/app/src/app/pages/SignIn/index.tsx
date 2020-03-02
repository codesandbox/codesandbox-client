import React, { useEffect } from 'react';
import { Redirect } from 'react-router-dom';

import { useOvermind } from 'app/overmind';
import { dashboardUrl } from '@codesandbox/common/lib/utils/url-generator';
import {
  Container,
  LoggedInContainer,
  LoggedInTitle,
  OffsettedLogo,
  Centered,
} from './elements';
import { SignInButton } from '../common/SignInButton';
import { Navigation } from '../common/Navigation';

const SignIn = () => {
  const {
    state,
    actions: { genericPageMounted },
  } = useOvermind();
  const redirectTo = new URL(location.href).searchParams.get('continue') || '/';

  useEffect(() => {
    genericPageMounted();
  }, [genericPageMounted]);

  if (state.hasLogIn && !redirectTo) {
    return <Redirect to={dashboardUrl()} />;
  }

  return (
    <div>
      <Navigation float title="Sign In" />
      <Container>
        <Centered>
          <LoggedInContainer>
            <OffsettedLogo />
            <LoggedInTitle>Sign in to CodeSandbox</LoggedInTitle>

            <SignInButton
              redirectTo={redirectTo}
              big
              style={{ fontSize: '1rem' }}
            />
          </LoggedInContainer>
        </Centered>
      </Container>
    </div>
  );
};

export default SignIn;
