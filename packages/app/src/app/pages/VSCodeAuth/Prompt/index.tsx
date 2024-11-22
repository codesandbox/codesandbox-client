import React, {
  FunctionComponent,
  useCallback,
  useEffect,
  useMemo,
} from 'react';
import { Button } from '@codesandbox/components';
import { notificationState } from '@codesandbox/common/lib/utils/notifications';
import { NotificationStatus } from '@codesandbox/notifications';
import { useLocation } from 'react-router-dom';
import { openUrl, UnsupportedProtocolError } from 'protocol-handlers';

import { SubTitle } from 'app/components/SubTitle';
import { Title } from 'app/components/Title';
import { useActions, useAppState } from 'app/overmind';

import { SignIn } from 'app/pages/SignIn/SignIn';
import { LogoFull } from '@codesandbox/common/lib/components/Logo';
import { Buttons, Container } from './elements';

type OpenEditorType = 'vscode' | 'vscode-insiders' | 'cursor';
export const editorInfoMapping: Record<
  OpenEditorType,
  { name: string; installUrl: string }
> = {
  vscode: { name: 'VS Code', installUrl: 'https://code.visualstudio.com/' },
  'vscode-insiders': {
    name: 'VS Code Insiders',
    installUrl: 'https://code.visualstudio.com/insiders/',
  },
  cursor: { name: 'Cursor', installUrl: 'https://www.cursor.com/' },
};

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
  const editorType = query.get('type') || ('vscode' as OpenEditorType);
  const editorInfo = editorInfoMapping[editorType];

  const actions = useActions();
  useEffect(() => {
    if (isLoggedIn && !authToken && !isLoadingAuthToken) {
      actions.internal.authorize();
    }
  }, [isLoggedIn]);

  const vscodeUrl = useMemo(() => {
    const url = new URL(
      'auth-completion',
      `${editorType}://CodeSandbox-io.codesandbox-projects/`
    );
    url.searchParams.set('token', authToken);

    return url;
  }, [authToken, editorType]);

  const openInVsCode = useCallback(() => {
    if (!authToken) {
      return;
    }

    openUrl(vscodeUrl).catch(openVsCodeError => {
      if (openVsCodeError instanceof UnsupportedProtocolError) {
        notificationState.addNotification({
          status: NotificationStatus.WARNING,
          message: `${editorInfo.name} is not installed`,
          actions: {
            primary: {
              label: 'Install',
              run: () => {
                window.open(
                  editorInfo.installUrl,
                  '_blank',
                  'noopener,noreferrer'
                );
              },
            },
          },
        });
        return;
      }

      notificationState.addNotification({
        status: NotificationStatus.ERROR,
        message: `Failed to launch ${editorInfo.name}`,
        actions: {
          primary: {
            label: 'Try again',
            run: () => openInVsCode(),
          },
        },
      });
    });
  }, [vscodeUrl, authToken]);

  if (
    editorType !== 'vscode' &&
    editorType !== 'vscode-insiders' &&
    editorType !== 'cursor'
  ) {
    return (
      <Container>
        <LogoFull style={{ paddingBottom: 32 }} />

        <Title>An error occured:</Title>
        <SubTitle>Editor type not supported</SubTitle>

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

        <SignIn />
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

      <Title style={{ paddingBottom: 4 }}>Hello {user.username}!</Title>

      <SubTitle>
        Click the button below to continue and finish signing in.
      </SubTitle>

      <Buttons>
        <Button
          autoWidth
          style={{ fontSize: 16, height: 40, width: '100%', marginTop: '1rem' }}
          onClick={openInVsCode}
        >
          {`Open ${editorInfo.name}`}
        </Button>
      </Buttons>
    </Container>
  );
};
