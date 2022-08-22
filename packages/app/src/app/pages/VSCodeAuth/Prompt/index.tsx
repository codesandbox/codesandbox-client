import { Button } from '@codesandbox/components';
import React, {
  FunctionComponent,
  useCallback,
  useEffect,
  useMemo,
} from 'react';
import { useLocation } from 'react-router-dom';
import { openUrl, UnsupportedProtocolError } from 'protocol-handlers';

import { SubTitle } from 'app/components/SubTitle';
import { Title } from 'app/components/Title';
import { useActions, useAppState } from 'app/overmind';

import { SignInModalElement } from 'app/pages/SignIn/Modal';
import { LogoFull } from '@codesandbox/common/lib/components/Logo';
import { Buttons, Container } from './elements';

export const Prompt: FunctionComponent = () => {
  const {
    authToken,
    isLoadingAuthToken,
    error,
    user,
    isLoggedIn,
  } = useAppState();
  const location = useLocation();
  const query = useMemo(() => new URLSearchParams(location.search), [
    location.search,
  ]);
  const isInsiders = query.get('insiders') === 'true';

  const actions = useActions();
  useEffect(() => {
    if (isLoggedIn && !authToken && !isLoadingAuthToken) {
      actions.internal.authorize();
    }
  }, [isLoggedIn]);

  const vscodeUrl = useMemo(() => {
    const url = new URL(
      '/auth-completion',
      'vscode://CodeSandbox-io.codesandbox-projects'
    );
    url.searchParams.set('token', authToken);

    if (isInsiders) {
      url.protocol = 'vscode-insiders://';
    }

    return url;
  }, [authToken, isInsiders]);

  const openInVsCode = useCallback(() => {
    if (!authToken) {
      return;
    }

    openUrl(vscodeUrl).catch(openVsCodeError => {
      if (openVsCodeError instanceof UnsupportedProtocolError) {
        /**
         * @todo Handle the error: IDE is not installed.
         * Show a notification.
         */
      }
    });
  }, [vscodeUrl, authToken]);

  // Attempt to open VS Code when the page mounts.
  useEffect(() => openInVsCode(), [openInVsCode]);

  if (error) {
    return (
      <Container>
        <LogoFull style={{ paddingBottom: 32 }} />

        <Title>An error occured:</Title>
        <SubTitle>{error}</SubTitle>

        <Buttons>
          <Button
            autoWidth
            href="/?from-app=1"
            style={{
              fontSize: 16,
              height: 40,
              width: '100%',
              marginTop: '1rem',
            }}
          >
            Go to homepage
          </Button>
        </Buttons>
      </Container>
    );
  }

  if (!user?.username) {
    return (
      <Container>
        <LogoFull style={{ paddingBottom: 32 }} />
        <Title>
          Welcome to <br />
          CodeSandbox!
        </Title>

        <SubTitle style={{ paddingBottom: 16 }}>You need to sign in.</SubTitle>

        <SignInModalElement />
      </Container>
    );
  }

  if (!authToken) {
    return (
      <Container>
        <LogoFull style={{ paddingBottom: 32 }} />
        <SubTitle>Fetching authorization key...</SubTitle>
      </Container>
    );
  }

  return (
    <Container>
      <LogoFull style={{ paddingBottom: 32 }} />

      <Title style={{ paddingBottom: 4 }}>
        Hello <br />
        {user.username}!
      </Title>

      <SubTitle>
        Click the button below to continue and finish signing in.
      </SubTitle>

      <Buttons>
        <Button
          as="a"
          autoWidth
          href={vscodeUrl.href}
          style={{ fontSize: 16, height: 40, width: '100%', marginTop: '1rem' }}
        >
          {isInsiders
            ? 'Open Visual Studio Code Insiders'
            : 'Open Visual Studio Code'}
        </Button>
      </Buttons>
    </Container>
  );
};
