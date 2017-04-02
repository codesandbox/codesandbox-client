// @flow
import React from 'react';
import styled from 'styled-components';
import { Route, Switch, Redirect } from 'react-router-dom';
import 'normalize.css';

import Notifications from 'app/containers/Notifications';
import ContextMenu from 'app/containers/ContextMenu';
import Sandbox from './Sandbox/';
import SignIn from './SignIn';
import NotFound from './NotFound';

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
      <Switch>
        <Route exact path="/" render={() => <Redirect to="/s/new" />} />
        <Route path="/s/:id" component={Sandbox} />
        <Route path="/signin/:jwt?" component={SignIn} />
        <Route component={NotFound} />
      </Switch>
    </Content>
  </Container>
);
