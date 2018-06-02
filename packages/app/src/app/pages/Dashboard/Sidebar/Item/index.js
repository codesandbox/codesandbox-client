import React, { Fragment } from 'react';
import { Route } from 'react-router-dom';
import { Container, IconContainer, ItemName } from './elements';

export default ({ name, Icon, path, children }) => (
  <Route path={path}>
    {res => (
      <Fragment>
        <Container to={path} activeClassName="active" exact>
          <IconContainer>
            <Icon />
          </IconContainer>
          <ItemName>{name}</ItemName>
        </Container>

        {children && children(res)}
      </Fragment>
    )}
  </Route>
);
