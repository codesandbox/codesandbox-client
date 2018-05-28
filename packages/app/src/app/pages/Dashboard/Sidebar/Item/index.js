import React from 'react';
import { Container, IconContainer, ItemName } from './elements';

export default ({ name, Icon }) => (
  <Container>
    <IconContainer>
      <Icon />
    </IconContainer>
    <ItemName>{name}</ItemName>
  </Container>
);
