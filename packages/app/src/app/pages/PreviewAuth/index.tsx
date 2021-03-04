import React, { useEffect } from 'react';
import { useAppState, useActions, useEffects } from 'app/overmind';
import { Redirect, RouteComponentProps, withRouter } from 'react-router-dom';
import Centered from '@codesandbox/common/lib/components/flex/Centered';
import Fullscreen from '@codesandbox/common/lib/components/flex/Fullscreen';

import {
  signInPageUrl,
  frameUrl,
} from '@codesandbox/common/lib/utils/url-generator';

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
      // eslint-disable-next-line
      const [id, port] = props.match.params.id.split('-');

      api
        .getSandbox(id)
        .then(sandbox => {
          const sandboxUrl = frameUrl(sandbox, '', {
            port: port ? Number.parseInt(port, 10) : undefined,
          });
          // Only send domains to urls from this sandbox
          const trustedDomain = new URL(sandboxUrl).origin;

          const listener = (e: MessageEvent) => {
            if (e.data && e.data.$type === 'request-preview-secret') {
              (e.source as WindowProxy).postMessage(
                {
                  $type: 'preview-secret',
                  previewSecret: sandbox.previewSecret,
                },
                trustedDomain
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
        <Title>{error ? 'Error: ' + error : 'Fetching Sandbox'}</Title>
      </Centered>
    </Fullscreen>
  ) : (
    <Redirect to={signInPageUrl(location.pathname)} />
  );
};

// eslint-disable-next-line import/no-default-export
export default withRouter(PreviewAuth);
