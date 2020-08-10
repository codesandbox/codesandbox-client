import { FunctionComponent, useEffect } from 'react';
import { protocolAndHost } from '@codesandbox/common/lib/utils/url-generator';
import { useOvermind } from 'app/overmind';

export const DuplicateAccount: FunctionComponent = () => {
  const { effects } = useOvermind();
  const providerToLoginWith = new URLSearchParams(location.search).get(
    'provider'
  );

  useEffect(() => {
    effects.analytics.track('Sign In - Duplicate Account', {
      provider: providerToLoginWith,
    });

    if (window.opener && window.opener !== window) {
      window.opener.postMessage(
        {
          type: 'duplicate',
          data: {
            provider: providerToLoginWith,
          },
        },
        protocolAndHost()
      );
    }
  }, []);

  return null;
};
