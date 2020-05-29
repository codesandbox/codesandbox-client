import { Sandbox } from '@codesandbox/common/es/types';
import { getSandboxName } from '@codesandbox/common/es/utils/get-sandbox-name';
import { sandboxUrl } from '@codesandbox/common/es/utils/url-generator';
import React, { FunctionComponent } from 'react';

import AvatarBlock from '../AvatarBlock';
import { Button, Container, Description, Stats, Title } from './elements';

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
      <Button
        href={sandboxUrl(sandbox) + '?from-embed'}
        target="_blank"
        rel="noreferrer noopener"
      >
        Edit Sandbox
      </Button>
    </Container>
  );
};
