import React from 'react';

import { Button, Stack, Input } from '@codesandbox/components';
import { teamInviteLink } from '@codesandbox/common/lib/utils/url-generator';

import { useOvermind } from 'app/overmind';
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
