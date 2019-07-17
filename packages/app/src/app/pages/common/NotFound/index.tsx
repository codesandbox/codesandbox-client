import React from 'react';
import { observer } from 'mobx-react-lite';

import { Button } from '@codesandbox/common/lib/components/Button';
import { newSandboxWizard } from '@codesandbox/common/lib/utils/url-generator';
import { useStore } from 'app/store';

import { Container, Title, SubTitle, Buttons } from './elements';

const NotFound = () => {
  const { hasLogIn } = useStore();

  return (
    <Container>
      <Title>404</Title>
      <SubTitle>
        We could not find the page you
        {"'"}
        re looking for.
      </SubTitle>
      <Buttons>
        <Button small block style={{ margin: '.5rem' }} to={newSandboxWizard()}>
          Create Sandbox
        </Button>
        <Button small block style={{ margin: '.5rem' }} href="/">
          {hasLogIn ? 'Dashboard' : 'Homepage'}
        </Button>
      </Buttons>
    </Container>
  );
};

export default observer(NotFound);
