import { FunctionComponent, useEffect } from 'react';
import styled from 'styled-components';

export const ApproveContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 200px;
  width: 100%;
  justify-content: space-around;
`;

// This is only available on https://codesandbox.stream and makes our dev flow better as
// we do not have to copy paste the CLI token
export const DevToken: FunctionComponent<{ authToken: string }> = ({
  authToken,
}) => {
  useEffect(() => {
    window.opener.postMessage(
      {
        type: 'CLI_TOKEN',
        token: authToken,
      },
      '*'
    );
  }, []);

  return null;
};
