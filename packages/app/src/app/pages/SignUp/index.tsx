import React, { useEffect } from 'react';
import { protocolAndHost } from '@codesandbox/common/lib/utils/url-generator';
import { useParams } from 'react-router-dom';

export const SignUp: React.FC = () => {
  const params: { userId?: string } = useParams();

  useEffect(() => {
    if (window.opener.location.origin === window.location.origin) {
      window.opener.postMessage(
        {
          type: 'signup',
          data: {
            id: params.userId,
          },
        },
        protocolAndHost()
      );
    }
  }, [params.userId]);

  return null;
};
