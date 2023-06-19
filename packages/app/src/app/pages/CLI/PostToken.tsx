import React, { FunctionComponent, useEffect } from 'react';
import { Title } from 'app/components/Title';

export const PostToken: FunctionComponent<{ authToken: string }> = ({
  authToken,
}) => {
  useEffect(() => {
    window.opener.postMessage(
      {
        type: 'CLI_TOKEN',
        token: authToken,
      },
      // We do not need to care about the origin here as this only happens when the popup
      // was triggered by user interaction and the token itself needs to be exchanged
      // in the API
      '*'
    );
  }, []);

  return <Title>Authorization key fetched!</Title>;
};
