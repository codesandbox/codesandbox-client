import { observer } from 'mobx-react-lite';
import React, { useEffect } from 'react';

import Navigation from 'app/pages/common/Navigation';
import { useSignals, useStore } from 'app/store';

import { Container } from './elements';
import Prompt from './Prompt';
import { User } from '@codesandbox/common/lib/types';

interface Props {
  authToken: string;
  error: string;
  isLoadingCLI: boolean;
  user: User;
}

const CLI = ({ authToken, error, isLoadingCLI, user }: Props) => {
  const { cliMounted, signInCliClicked } = useSignals();
  const { user, authToken, isLoadingCLI, error } = useStore();

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
