import React from 'react';
import css from '@styled-system/css';
import { withTheme } from 'styled-components';
import {
  Button,
  Input,
  ThemeProvider,
  Element,
  Text,
} from '@codesandbox/components';
import { protocolAndHost } from '@codesandbox/common/lib/utils/url-generator';

import { SubTitle } from 'app/components/SubTitle';
import { Title } from 'app/components/Title';
import { LogoFull } from '@codesandbox/common/lib/components/Logo';
import { Container } from './elements';

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
          overflow: 'hidden',
          backgroundColor: 'sideBar.background',
        })}
      >
        <Element
          css={css({
            height: '100%',
            width: '100%',
            padding: '0 1em',
            boxSizing: 'border-box',
          })}
        >
          <Container>
            <LogoFull />
            <Title>Developer Sign In</Title>
            <SubTitle style={{ paddingBottom: 16 }}>
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
              . This token will sign you in with your account from
              codesandbox.io.
            </SubTitle>

            <Input
              style={{ width: '100%', height: 42, fontSize: 16 }}
              placeholder="Auth Code"
              value={authCode}
              onChange={e => {
                setAuthCode(e.target.value);
              }}
            />
            <Button
              onClick={getJWTToken}
              style={{
                fontSize: 16,
                height: 40,
                width: '100px',
                marginTop: '1rem',
                display: 'block',
              }}
            >
              Submit
            </Button>

            {error && <Text style={{ marginTop: '2rem' }}>Error: {error}</Text>}
          </Container>
        </Element>
      </Element>
    </ThemeProvider>
  );
});
