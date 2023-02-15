import React, { useEffect } from 'react';
import { useAppState, useActions, useEffects } from 'app/overmind';
import { Redirect, RouteComponentProps, withRouter } from 'react-router-dom';
import { css } from '@styled-system/css';
import { signInPageUrl } from '@codesandbox/common/lib/utils/url-generator';

import { CodeSandboxIcon } from '@codesandbox/components/lib/components/Icon/icons';

import { Element, Stack, ThemeProvider, Text } from '@codesandbox/components';

// This route is supposed to be opened in a new window.
// It is called from a sandbox so that we can try to retrieve
// a sandbox from the root domain and return the preview secret.
// This is purely used to auth a sandbox. It should return a postMessage
// with the previewSecret to the parent
const SandpackSecret = (props: RouteComponentProps<{ id: string }>) => {
  const { hasLogIn } = useAppState();
  const { api } = useEffects();
  const { genericPageMounted } = useActions();

  const [error, setError] = React.useState<string>();

  useEffect(() => {
    genericPageMounted();
  }, [genericPageMounted]);

  useEffect(() => {
    if (hasLogIn) {
      setError(null);

      const listener = async (event: MessageEvent) => {
        if (event.data && event.data.$type === 'request-sandpack-secret') {
          const parentWindow = event.data.parentDomain;

          api
            .getSandpackToken(parentWindow)
            .then(token => {
              /**
               * TODO: perform this on the backend
               */
              const TEMP_ALLOWED_DOMAINS = ['http://localhost:6006'];
              const TODO_BACKEND_CHECK = TEMP_ALLOWED_DOMAINS.includes(
                parentWindow
              );

              if (TODO_BACKEND_CHECK) {
                (event.source as WindowProxy).postMessage(
                  { $type: 'sandpack-secret', token },
                  event.origin
                );
              } else {
                setError('Operation not allowed');
              }

              window.removeEventListener('message', listener);
            })
            .catch(e => {
              setError("We couldn't find the sandbox");
            });
        }
      };

      window.addEventListener('message', listener);
    }
  }, [api, props.match.params.id, hasLogIn]);

  return hasLogIn ? (
    <ThemeProvider>
      <Element
        css={css({
          backgroundColor: 'sideBar.background',
          minHeight: '100vh',
          minWidth: '100vw',
          display: 'flex',
        })}
      >
        <Stack
          align="center"
          css={{
            margin: 'auto',
            padding: '48px 0',
            color: '#fff',
          }}
          direction="vertical"
          justify="space-between"
          gap={8}
        >
          <Stack css={{ gap: '1em' }} align="center">
            <CodeSandboxIcon width={48} height={48} />
            <Text
              as="h1"
              css={{
                margin: 0,
                textAlign: 'center',
                fontFamily: 'Everett, sans-serif',
                lineHeight: 1.17,
                letterSpacing: '-0.018em',
              }}
              size={34}
              weight="medium"
            >
              CodeSandbox
            </Text>
          </Stack>

          <Text css={{ textAlign: 'center' }}>
            Hang on, we are authenticating Sandpack.
            <br />
            {error
              ? 'Error: ' + error
              : 'This page will close automatically in a few seconds.'}
          </Text>
        </Stack>
      </Element>
    </ThemeProvider>
  ) : (
    <Redirect to={signInPageUrl(location.pathname)} />
  );
};

// eslint-disable-next-line import/no-default-export
export default withRouter(SandpackSecret);
