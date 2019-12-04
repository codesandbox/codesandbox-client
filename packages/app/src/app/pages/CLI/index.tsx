import React, { useEffect } from 'react';
import { Navigation } from 'app/pages/common/Navigation';
import { useOvermind } from 'app/overmind';
import { Container } from './elements';
import { Prompt } from './Prompt';

interface CliProps {
  small: boolean;
}

const CLI: React.FunctionComponent<CliProps> = ({ small }) => {
  const {
    state: { user, authToken, isLoadingCLI, error },
    actions: { cliMounted, signInCliClicked },
  } = useOvermind();

  useEffect(() => {
    cliMounted();
  }, [cliMounted]);

  return (
    <Container>
      <Navigation title="CLI Authorization" />

      <Prompt
        error={error}
        loading={isLoadingCLI}
        signIn={signInCliClicked}
        token={authToken}
        username={user && user.username}
      />
    </Container>
  );
};

// eslint-disable-next-line import/no-default-export
export default CLI;
