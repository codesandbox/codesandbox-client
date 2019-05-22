import { observer } from 'mobx-react-lite';
import React, { useEffect } from 'react';

import Navigation from 'app/pages/common/Navigation';
import { useSignals } from 'app/store';

import { Container } from './elements';
import Prompt from './Prompt';

const CLI = ({ authToken, error, isLoadingCLI, user }) => {
  const { cliMounted, signInCliClicked } = useSignals();

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

export default observer(CLI);
