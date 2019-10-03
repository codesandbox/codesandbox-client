import React, { FunctionComponent, useEffect } from 'react';

import { useOvermind } from 'app/overmind';
import { Navigation } from 'app/pages/common/Navigation';

import { Container } from './elements';
import { Prompt } from './Prompt';

const CLI: FunctionComponent = () => {
  const {
    actions: { cliMounted, signInCliClicked },
    state: { user, authToken, isLoadingCLI, error },
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

export default CLI;
