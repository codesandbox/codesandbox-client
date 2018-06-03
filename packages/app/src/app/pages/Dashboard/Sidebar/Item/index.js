import React, { Fragment } from 'react';
import { Route } from 'react-router-dom';
import { Container, IconContainer, ItemName } from './elements';
import ContextMenu from 'app/components/ContextMenu';

const getContainer = contextItems => {
  if (contextItems) {
    return ({ children, ...props }) => (
      <ContextMenu items={contextItems}>
        <Container {...props}>{children}</Container>
      </ContextMenu>
    );
  }

  return Container;
};

export default ({ name, contextItems, Icon, path, children }) => {
  const UsedContainer = getContainer(contextItems);

  return (
    <Route path={path}>
      {res => (
        <Fragment>
          <UsedContainer to={path} activeClassName="active" exact>
            <IconContainer>
              <Icon />
            </IconContainer>
            <ItemName>{name}</ItemName>
          </UsedContainer>

          {children && children(res)}
        </Fragment>
      )}
    </Route>
  );
};
