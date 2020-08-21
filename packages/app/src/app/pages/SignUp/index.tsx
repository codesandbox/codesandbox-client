import React, { useEffect } from 'react';
import { protocolAndHost } from '@codesandbox/common/lib/utils/url-generator';
import { useParams } from 'react-router-dom';
import history from 'app/utils/history';
import { useOvermind } from 'app/overmind';

export const SignUp: React.FC = () => {
  const params: { userId?: string } = useParams();
  const { actions } = useOvermind();

  useEffect(() => {
    if (window.opener?.location?.origin === window.location.origin) {
      window.opener.postMessage(
        {
          type: 'signup',
          data: {
            id: params.userId,
          },
        },
        protocolAndHost()
      );
    } else {
      actions.setPendingUserId(params.userId);
      history.push('/signin');
    }
  }, [params.userId]);

  return null;
};
