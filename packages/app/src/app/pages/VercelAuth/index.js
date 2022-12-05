import React, { useEffect, useState } from 'react';
import Centered from '@codesandbox/common/lib/components/flex/Centered';
import {
  protocolAndHost,
  signInUrl,
  newSandboxUrl,
} from '@codesandbox/common/lib/utils/url-generator';
import { Title } from 'app/components/Title';

const VercelSignIn = () => {
  const [redirect, setRedirect] = useState(null);
  const [jwt] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const queryParams = new URLSearchParams(document.location.search);
    const code = queryParams.get('code');

    if (code) {
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
