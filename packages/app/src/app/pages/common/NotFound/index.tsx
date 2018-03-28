import * as React from 'react';

import SubTitle from 'app/components/SubTitle';
import Button from 'app/components/Button';
import { newSandboxWizard } from 'common/utils/url-generator';

import { Container, Title, Buttons } from './elements';

const NotFound: React.SFC = () => {
  return (
    <Container>
      <Title>404</Title>
      <SubTitle>We could not find the page you{"'"}re looking for :(</SubTitle>
      <Buttons>
        <Button href="/">To Homepage</Button>
        <Button to={newSandboxWizard()}>Create Sandbox</Button>
      </Buttons>
    </Container>
  );
}

export default NotFound;
