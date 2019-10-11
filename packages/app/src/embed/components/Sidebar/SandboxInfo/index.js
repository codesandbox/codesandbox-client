import React from 'react';
import { Container, Title, Description } from './elements';
import AvatarBlock from '../AvatarBlock';

const SandboxInfo = ({ sandbox }) => {
  const title = sandbox.title || sandbox.id;

  return (
    <Container>
      <Title title={title}>{title}</Title>
      {sandbox.description && <Description>{sandbox.description}</Description>}
      {sandbox.author && (
        <AvatarBlock
          url={sandbox.author.avatarUrl}
          name={sandbox.author.username}
        />
      )}
    </Container>
  );
};

export default SandboxInfo;
