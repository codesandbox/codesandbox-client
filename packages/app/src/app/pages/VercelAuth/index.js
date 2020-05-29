import Centered from '@codesandbox/common/es/components/flex/Centered';
import {
  newSandboxUrl,
  protocolAndHost,
  signInUrl,
} from '@codesandbox/common/es/utils/url-generator';
import { Title } from 'app/components/Title';
import React, { useEffect, useState } from 'react';

const VercelSignIn = () => {
  const [redirect, setRedirect] = useState(null);
  const [jwt] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (document.location.search.match(/\?code=(.*)/)) {
      // eslint-disable-next-line
      const [_, code] = document.location.search.match(/\?code=(.*)/);
      if (window.opener) {
        if (window.opener.location.origin === window.location.origin) {
          window.opener.postMessage(
            {
              type: 'signin',
              data: {
                code,
              },
            },
            protocolAndHost()
          );
        }
        return;
      }
      setRedirect('/');

      return;
    }

    setError('no message received');
  }, []);

  const getMessage = () => {
    if (redirect) {
      document.location.href = newSandboxUrl();
      return 'Redirecting to sandbox page';
    }
    if (error) {
      return `Something went wrong while signing in: ${error}`;
    }
    if (jwt) return 'Signing in...';
    if (jwt == null) {
      setTimeout(() => {
        document.location.href = signInUrl();
      }, 2000);
      return 'Redirecting to sign in page...';
    }

    return 'Hey';
  };

  return (
    <Centered horizontal vertical>
      <Title>{getMessage()}</Title>
    </Centered>
  );
};

export default VercelSignIn;
