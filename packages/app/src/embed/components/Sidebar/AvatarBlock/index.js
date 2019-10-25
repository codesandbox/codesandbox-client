import React from 'react';
import { Container, Avatar, Name } from './elements';

const AvatarBlock = ({ url, name }) => (
  <Container>
    <Avatar src={url} />
    <Name>{name}</Name>
  </Container>
);

export default AvatarBlock;
