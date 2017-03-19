// @flow
import React from 'react';
import styled from 'styled-components';
import { Route } from 'react-router-dom';
import 'normalize.css';

// import Header from '../components/Header';
import Notifications from '../containers/Notifications';
import ContextMenu from '../containers/ContextMenu';
import SandboxView from './SandboxView/';
import Create from './SandboxView/Create';

const Container = styled.div`
  display: flex;
  height: 100%;
  flex-direction: column;
  margin: 0;
`;

const Content = styled.div`
  flex: auto;
  display: flex;
  background-color: ${props => props.theme.background2};
`;

export default () => (
  <Container>
    <Notifications />
    <ContextMenu />
    {/*<Header />*/}
    <Content>
      <Route exact path="/" component={Create} />
      <Route path="/s" component={SandboxView} />
    </Content>
  </Container>
);
