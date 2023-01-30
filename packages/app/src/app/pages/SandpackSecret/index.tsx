import React, { useEffect } from 'react';
import { useAppState, useActions, useEffects } from 'app/overmind';
import { Redirect, RouteComponentProps, withRouter } from 'react-router-dom';
import Centered from '@codesandbox/common/lib/components/flex/Centered';
import Fullscreen from '@codesandbox/common/lib/components/flex/Fullscreen';

import { signInPageUrl } from '@codesandbox/common/lib/utils/url-generator';

import { Title } from 'app/components/Title';

// This route is supposed to be opened in a new window.
// It is called from a sandbox so that we can try to retrieve
// a sandbox from the root domain and return the preview secret.
// This is purely used to auth a sandbox. It should return a postMessage
// with the previewSecret to the parent
const PreviewAuth = (props: RouteComponentProps<{ id: string }>) => {
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

      api
        .getJWTToken()
        .then(token => {
          const listener = (e: MessageEvent) => {
            if (e.data && e.data.$type === 'request-sandpack-secret') {
              (e.source as WindowProxy).postMessage(
                {
                  $type: 'sandpack-secret',
                  token,
                },
                '*'
              );

              window.removeEventListener('message', listener);
            }
          };

          window.addEventListener('message', listener);
        })
        .catch(e => {
          setError("We couldn't find the sandbox");
        });
    }
  }, [api, props.match.params.id, hasLogIn]);

  return hasLogIn ? (
    <Fullscreen style={{ height: '100vh' }}>
      <Centered horizontal vertical>
        <Title>{error ? 'Error: ' + error : 'Fetching...'}</Title>
      </Centered>
    </Fullscreen>
  ) : (
    <Redirect to={signInPageUrl(location.pathname)} />
  );
};

// eslint-disable-next-line import/no-default-export
export default withRouter(PreviewAuth);
