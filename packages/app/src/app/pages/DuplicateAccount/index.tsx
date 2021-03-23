import { FunctionComponent, useEffect } from 'react';
import { protocolAndHost } from '@codesandbox/common/lib/utils/url-generator';
import { useEffects } from 'app/overmind';

export const DuplicateAccount: FunctionComponent = () => {
  const { analytics } = useEffects();
  const providerToLoginWith = new URLSearchParams(location.search).get(
    'provider'
  );

  useEffect(() => {
    analytics.track('Sign In - Duplicate Account', {
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
};
