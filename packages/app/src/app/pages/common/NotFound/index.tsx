import { Button } from '@codesandbox/common/lib/components/Button';
import { newSandboxWizard } from '@codesandbox/common/lib/utils/url-generator';
import React, { FunctionComponent } from 'react';

import { useOvermind } from 'app/overmind';

import { Container, Title, SubTitle, Buttons } from './elements';

export const NotFound: FunctionComponent = () => {
  const {
    state: { hasLogIn },
  } = useOvermind();

  return (
    <Container>
      <Title>404</Title>

      <SubTitle>
        We could not find the page you
        {"'"}
        re looking for.
      </SubTitle>

      <Buttons>
        <Button small block css="margin: .5rem" to={newSandboxWizard()}>
          Create Sandbox
        </Button>

        <Button small block css="margin: .5rem" href="/">
          {hasLogIn ? 'Dashboard' : 'Homepage'}
        </Button>
      </Buttons>
    </Container>
  );
};

// eslint-disable-next-line import/no-default-export
export default NotFound;
