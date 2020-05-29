import Centered from '@codesandbox/common/es/components/flex/Centered';
import Fullscreen from '@codesandbox/common/es/components/flex/Fullscreen';
import {
  frameUrl,
  signInPageUrl,
} from '@codesandbox/common/es/utils/url-generator';
import { Title } from 'app/components/Title';
import { useOvermind } from 'app/overmind';
import React, { useEffect } from 'react';
import { Redirect, RouteComponentProps, withRouter } from 'react-router-dom';

// This route is supposed to be opened in a new window.
// It is called from a sandbox so that we can try to retrieve
// a sandbox from the root domain and return the preview secret.
// This is purely used to auth a sandbox. It should return a postMessage
// with the previewSecret to the parent
const PreviewAuth = (props: RouteComponentProps<{ id: string }>) => {
  const {
    state,
    actions: { genericPageMounted },
    effects,
  } = useOvermind();

  const [error, setError] = React.useState<string>();

  useEffect(() => {
    genericPageMounted();
  }, [genericPageMounted]);

  useEffect(() => {
    if (state.hasLogIn) {
      setError(null);
      // eslint-disable-next-line
      const [id, port] = props.match.params.id.split('-');

      effects.api
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
  }, [effects.api, props.match.params.id, state.hasLogIn]);

  return state.hasLogIn ? (
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
