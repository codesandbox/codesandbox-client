import { Sandbox } from '@codesandbox/common/lib/types';
import { getSandboxName } from '@codesandbox/common/lib/utils/get-sandbox-name';
import React, { FunctionComponent } from 'react';

import AvatarBlock from '../AvatarBlock';

import { Container, Description, Stats, Title } from './elements';

type Props = {
  sandbox: Sandbox;
};
export const SandboxInfo: FunctionComponent<Props> = ({ sandbox }) => {
  const title = getSandboxName(sandbox);

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

      <Stats {...sandbox} />
    </Container>
  );
};
