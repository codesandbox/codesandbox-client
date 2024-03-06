import { Sandbox } from '@codesandbox/common/lib/types';
import { getSandboxName } from '@codesandbox/common/lib/utils/get-sandbox-name';
import { sandboxUrl } from '@codesandbox/common/lib/utils/url-generator';
import React, { FunctionComponent } from 'react';

import AvatarBlock from '../AvatarBlock';

import { Container, Description, Stats, Title, Button } from './elements';

type Props = {
  sandbox: Sandbox;
};
export const SandboxInfo: FunctionComponent<Props> = ({ sandbox }) => {
  const title = getSandboxName(sandbox);

  let author;

  if (sandbox.team) {
    author = {
      avatarUrl: sandbox.team.avatarUrl,
      name: sandbox.team.name,
    };
  } else if (sandbox.author) {
    author = {
      avatarUrl: sandbox.author.avatarUrl,
      name: sandbox.author.username,
    };
  }

  return (
    <Container>
      <Title title={title}>{title}</Title>
      {sandbox.description && <Description>{sandbox.description}</Description>}

      {author && <AvatarBlock url={author.avatarUrl} name={author.name} />}
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
