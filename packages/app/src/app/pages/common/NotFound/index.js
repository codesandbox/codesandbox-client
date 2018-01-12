import React from 'react';

import SubTitle from 'app/components/SubTitle';
import Button from 'app/components/Button';
import { newSandboxUrl } from 'common/utils/url-generator';

import { Container, Title, Buttons } from './elements';

function NotFound() {
  return (
    <Container>
      <Title>404</Title>
      <SubTitle>We could not find the page you{"'"}re looking for :(</SubTitle>
      <Buttons>
        <Button href="/">To Homepage</Button>
        <Button to={newSandboxUrl()}>Create Sandbox</Button>
      </Buttons>
    </Container>
  );
}
export default NotFound;
