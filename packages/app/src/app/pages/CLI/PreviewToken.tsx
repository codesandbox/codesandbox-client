import React, { FunctionComponent, useState } from 'react';
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

export const PreviewToken: FunctionComponent<{ authToken: string }> = ({
  authToken,
}) => {
  const [isApproving, setIsApproving] = useState(false);
  return (
    <ApproveContainer>
      <Title>
        You are about to sign in to access development tools on a preview
      </Title>
      <Button
        variant="primary"
        disabled={isApproving}
        onClick={() => {
          localStorage.setItem(LOCAL_STORAGE_TOKEN_KEY, authToken);
          setIsApproving(true);
        }}
      >
        I trust this preview
      </Button>
    </ApproveContainer>
  );
};
