import React, { FunctionComponent } from 'react';
import { Title } from 'app/components/Title';
import { Button } from '@codesandbox/components';
import styled from 'styled-components';

export const ApproveContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 200px;
  width: 100%;
  justify-content: space-around;
`;

export const PostToken: FunctionComponent<{ authToken: string }> = ({
  authToken,
}) => {
  return (
    <ApproveContainer>
      <Title>Authorization key fetched!</Title>
      <Button
        variant="primary"
        onClick={() => {
          window.opener.postMessage(
            {
              type: 'CLI_TOKEN',
              token: authToken,
            },
            // We do not need to care about the origin here as this only happens when the popup
            // was triggered by user interaction and also approving it requires user interaction. A bad
            // site could open this popup and pass the token to the server to exchange for auth token,
            // but that means the user has TWICE allowed access
            '*'
          );
        }}
      >
        Approve access
      </Button>
    </ApproveContainer>
  );
};
