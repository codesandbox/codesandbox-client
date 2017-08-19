// @flow
import React from 'react';
import styled from 'styled-components';

import Navigation from 'app/containers/Navigation';
import Centered from 'app/components/flex/Centered';
import Title from 'app/components/text/Title';
import SubTitle from 'app/components/text/SubTitle';

const Container = styled.div`
  height: 100%;
  width: 100%;
  margin: 1rem;
`;

const Content = styled(Centered)`
  max-width: 50em;
  margin: auto;
  margin-top: 10%;
`;

const Code = styled.pre`
  margin-bottom: 1rem;
  color: rgba(255, 255, 255, 0.7);
`;

export default () =>
  <Container>
    <Navigation title="CLI Import" />
    <Content vertical>
      <Title>Import from CLI</Title>
      <SubTitle>
        1. Install the CLI <Code>npm i -g codesandbox</Code>
      </SubTitle>
      <SubTitle>
        2. Go to your `create-react-app` project{' '}
        <Code>cd path-of-your-project</Code>
      </SubTitle>
      <SubTitle>
        3. Deploy your project to CodeSandbox <Code>codesandbox ./</Code>
      </SubTitle>
    </Content>
  </Container>;
