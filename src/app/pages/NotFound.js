import React from 'react';
import styled from 'styled-components';

import SubTitle from 'app/components/text/SubTitle';
import Button from 'app/components/buttons/Button';
import { newSandboxUrl } from 'app/utils/url-generator';

const Container = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  font-size: 1.5rem;
  color: white;
`;

const Title = styled.h1`
  margin-bottom: 0;
`;

const Buttons = styled.div`
  display: flex;
  justify-content: space-around;
  min-width: 450px;
  flex-wrap: wrap;
  margin-top: 0.5rem;
`;

export default () => (
  <Container>
    <Title>404</Title>
    <SubTitle>We could not find the page you{"'"}re looking for :(</SubTitle>
    <Buttons>
      <Button href="/">To Homepage</Button>
      <Button to={newSandboxUrl()}>Create Sandbox</Button>
    </Buttons>
  </Container>
);
