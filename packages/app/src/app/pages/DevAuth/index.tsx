import React from 'react';
import css from '@styled-system/css';
import { withTheme } from 'styled-components';
import {
  Button,
  Input,
  ThemeProvider,
  Element,
  Text,
  Stack,
} from '@codesandbox/components';
import { protocolAndHost } from '@codesandbox/common/lib/utils/url-generator';

export const DevAuthPage = withTheme(({ theme }) => {
  const [authCode, setAuthCode] = React.useState('');
  const [error, setError] = React.useState<string | null>(null);

  const getJWTToken = () => {
    setError(null);
    let ok = true;
    fetch(`/api/v1/auth/verify/${authCode}`)
      .then(res => {
        ok = res.ok;
        return res.json();
      })
      .then(res => {
        if (!ok) {
          throw new Error(res.errors.detail[0]);
        }
        if (
          window.opener &&
          window.opener.location.origin === window.location.origin
        ) {
          window.opener.postMessage(
            {
              type: 'signin',
              data: {
                jwt: res.data.token,
              },
            },
            protocolAndHost()
          );
        }
      })
      .catch(e => {
        setError(e.message);
      });
  };

  const baseSignInDomain = process.env.ENDPOINT || 'https://codesandbox.io';
  const cliLoginUrl = `${baseSignInDomain}/cli/login`;
  return (
    <ThemeProvider theme={theme.vsCode}>
      <Element
        css={css({
          width: '100vw',
          height: '100vh',
          backgroundColor: 'sideBar.background',
          fontFamily: 'Inter',
          color: 'white',
        })}
      >
        <Text size={8} align="center" block marginY={4}>
          Developer Sign In
        </Text>
        <Text
          size={4}
          block
          align="center"
          css={css({ maxWidth: 800, margin: ' auto' })}
        >
          Please enter the token you get from{' '}
          <a
            href={cliLoginUrl}
            target="popup"
            rel="noreferrer noopener"
            onClick={e => {
              e.preventDefault();
              window.open(cliLoginUrl, 'popup', 'width=600,height=600');
              return false;
            }}
          >
            here
          </a>
          . This token will sign you in with your account from codesandbox.io.
        </Text>
        <Stack justify="center" marginTop={4}>
          <Input
            style={{ width: 600, height: 26 }}
            placeholder="Auth Code"
            value={authCode}
            onChange={e => {
              setAuthCode(e.target.value);
            }}
          />
          <Button autoWidth onClick={getJWTToken}>
            Submit
          </Button>
        </Stack>

        {error && <Text style={{ marginTop: '1rem' }}>Error: {error}</Text>}
      </Element>
    </ThemeProvider>
  );
});
