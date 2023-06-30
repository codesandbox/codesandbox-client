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

const LOCAL_STORAGE_TOKEN_KEY = 'CSB_CLI_TOKEN';

export const LocalToken: FunctionComponent<{ authToken: string }> = ({
  authToken,
}) => {
  return (
    <ApproveContainer>
      <Title>Authorization key fetched!</Title>
      <Button
        variant="primary"
        onClick={() => {
          localStorage.setItem(LOCAL_STORAGE_TOKEN_KEY, authToken);
        }}
      >
        Approve access
      </Button>
    </ApproveContainer>
  );
};
