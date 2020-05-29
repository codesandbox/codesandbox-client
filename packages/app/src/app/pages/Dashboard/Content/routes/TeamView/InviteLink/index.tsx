import { teamInviteLink } from '@codesandbox/common/es/utils/url-generator';
import { Button, Input, Stack } from '@codesandbox/components';
import { useOvermind } from 'app/overmind';
import React from 'react';

import { IInviteLinkProps } from './types';

export const InviteLink: React.FC<IInviteLinkProps> = ({ inviteToken }) => {
  const { effects } = useOvermind();

  const [isCopied, setIsCopied] = React.useState(false);

  const inviteLink = teamInviteLink(inviteToken);

  const copyLink = () => {
    setIsCopied(true);
    effects.browser.copyToClipboard(inviteLink);

    setTimeout(() => {
      setIsCopied(false);
    }, 2000);
  };

  return (
    <Stack gap={2}>
      <Input onClick={e => e.target.select()} value={inviteLink} />
      <Button onClick={copyLink} style={{ width: 200 }}>
        {isCopied ? 'Copied!' : 'Copy Invite Link'}
      </Button>
    </Stack>
  );
};
