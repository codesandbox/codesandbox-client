import { inject, observer } from 'mobx-react';
import React, { useEffect } from 'react';

import Navigation from 'app/pages/common/Navigation';

import { Container } from './elements';
import Prompt from './Prompt';

const CLI = ({
  authToken,
  error,
  isLoadingCLI,
  signals: { cliMounted, signInCliClicked },
  user,
}) => {
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

export default inject('store', 'signals')(observer(CLI));
