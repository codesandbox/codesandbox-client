import React from 'react';
import { Container, Avatar, PrimaryName, AvatarPlaceholder } from './elements';

const AvatarBlock = ({ url, name }) => (
  <Container>
    {url ? (
      <Avatar src={url} />
    ) : (
      <AvatarPlaceholder>{name.charAt(0).toUpperCase()}</AvatarPlaceholder>
    )}
    <PrimaryName>{name}</PrimaryName>
  </Container>
);

export default AvatarBlock;
