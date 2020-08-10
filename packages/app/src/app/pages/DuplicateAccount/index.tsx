import { FunctionComponent, useEffect } from 'react';
import { protocolAndHost } from '@codesandbox/common/lib/utils/url-generator';

export const DuplicateAccount: FunctionComponent = () => {
  const providerToLoginWith = new URLSearchParams(location.search).get(
    'provider'
  );

  useEffect(() => {
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
