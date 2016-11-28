import React from 'react';
import styled from 'styled-components';
import { BrowserRouter, Match } from 'react-router';
import 'normalize.css';

import Header from '../components/Header';

import Modal from '../containers/Modal';
import Root from './Root';
import SandboxEditor from './SandboxEditor/';

const Container = styled.div`
  display: flex;
  height: 100%;
  flex-direction: column;
  margin: 0;
`;

const Content = styled.div`
  flex: auto;
  display: flex;
`;

export default () => (
  <BrowserRouter>
    <Container>
      <Modal />
      <Header />
      <Content>
        <Match className="test" exactly pattern="/" component={Root} />
        <Match pattern="/sandbox/:sandbox/:module?" component={SandboxEditor} />
      </Content>
    </Container>
  </BrowserRouter>
);
