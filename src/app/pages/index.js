// @flow
import React from 'react';
import styled from 'styled-components';
import { Route, Redirect } from 'react-router-dom';
import 'normalize.css';

import Notifications from '../containers/Notifications';
import ContextMenu from '../containers/ContextMenu';
import SandboxView from './SandboxView/';

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
    <Content>
      <Route exact path="/" render={() => <Redirect to="/s/new" />} />
      <Route path="/s" component={SandboxView} />
    </Content>
  </Container>
);
