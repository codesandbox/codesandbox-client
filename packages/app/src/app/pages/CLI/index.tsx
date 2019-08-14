import React, { useEffect } from 'react';

import { inject, hooksObserver } from 'app/componentConnectors';
import Navigation from 'app/pages/common/Navigation';

import { Container } from './elements';
import Prompt from './Prompt';

interface Props {
  small: boolean;
  store: any;
  signals: any;
}

const CLI = inject('store', 'signals')(
  hooksObserver(
    ({
      signals: { cliMounted, signInCliClicked },
      store: { user, authToken, isLoadingCLI, error },
    }: Props) => {
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
    }
  )
);

export default CLI;
