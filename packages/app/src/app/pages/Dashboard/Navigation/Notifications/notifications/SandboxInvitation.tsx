import React from 'react';
import { Link } from 'react-router-dom';

import { sandboxUrl } from '@codesandbox/common/lib/utils/url-generator';
import { Authorization } from 'app/graphql/types';
import { NotificationImage as Image } from '../elements';
import { Container, W } from './elements';

interface ISandboxInvitationProps {
  read: boolean;
  inviterAvatar: string;
  inviterName: string;
  sandboxId: string;
  sandboxAlias: string | null;
  sandboxTitle: string | null;
  authorization: Authorization;
}

export const SandboxInvitation = ({
  read,
  inviterAvatar,
  inviterName,
  sandboxId,
  sandboxAlias,
  sandboxTitle,
  authorization,
}: ISandboxInvitationProps) => {
  const niceSandboxTitle = sandboxTitle || sandboxAlias || sandboxId;
  let nicePermissionName = 'view';
  if (authorization === Authorization.Comment) {
    nicePermissionName = 'comment on';
  } else if (authorization === Authorization.WriteCode) {
    nicePermissionName = 'edit';
  }

  return (
    <div>
      <Container
        as={Link}
        to={sandboxUrl({ id: sandboxId, alias: sandboxAlias })}
        read={read}
      >
        <Image src={inviterAvatar} />
        <div>
          <W>{inviterName}</W> invited you to {nicePermissionName}{' '}
          <W>{niceSandboxTitle}</W>
        </div>
      </Container>
    </div>
  );
};
