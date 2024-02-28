import React from 'react';
import {
  Container,
  Avatar,
  PrimaryName,
  AuthorName,
  AvatarPlaceholder,
} from './elements';

const AvatarBlock = ({ url, name, teamName }) => (
  <Container>
    {url ? (
      <Avatar src={url} />
    ) : (
      <AvatarPlaceholder>{teamName.charAt(0).toUpperCase()}</AvatarPlaceholder>
    )}
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      {teamName && teamName !== name ? (
        <>
          <PrimaryName>{teamName}</PrimaryName>
          <AuthorName>{name}</AuthorName>
        </>
      ) : (
        <PrimaryName>{name}</PrimaryName>
      )}
    </div>
  </Container>
);

export default AvatarBlock;
