import React, { useState } from 'react';
import {
  Avatar,
  Button,
  IconButton,
  Label,
  List,
  ListItem,
  Stack,
  Text,
  Input,
} from '@codesandbox/components';
import { useActions, useAppState, useEffects } from 'app/overmind';
import { StyledButton } from 'app/components/dashboard/Button';
import { TeamMemberAuthorization } from 'app/graphql/types';
import track from '@codesandbox/common/lib/utils/analytics';
import { UserSearchInput } from 'app/components/UserSearchInput';
import { sortBy } from 'lodash-es';
import { css } from 'styled-components';
import { teamInviteLink } from '@codesandbox/common/lib/utils/url-generator';

export const TeamMembers: React.FC<{ onComplete: () => void }> = ({
  onComplete,
}) => {
  const { activeTeamInfo } = useAppState();
  const actions = useActions();
  const { copyToClipboard } = useEffects().browser;

  const inviteLink = teamInviteLink(activeTeamInfo.inviteToken);
  const [inviteValue, setInviteValue] = useState<string>('');
  const [linkCopied, setLinkCopied] = React.useState(false);
  const copyLinkTimeoutRef = React.useRef<number>();

  const copyLink = () => {
    copyToClipboard(inviteLink);
    setLinkCopied(true);

    if (copyLinkTimeoutRef.current) {
      window.clearTimeout(copyLinkTimeoutRef.current);
    }
    copyLinkTimeoutRef.current = window.setTimeout(() => {
      setLinkCopied(false);
    }, 1500);
  };

  const [loading, setLoading] = React.useState(false);
  const onSubmit = async event => {
    event.preventDefault();
    setLoading(true);
    setInviteValue('');
    await actions.dashboard.inviteToTeam({
      value: inviteValue,
      authorization: TeamMemberAuthorization.Write,
      triggerPlace: 'invite-modal',
      inviteLink: location.href,
    });
    setLoading(false);
  };

  return (
    <Stack
      align="center"
      direction="vertical"
      gap={6}
      css={{
        paddingTop: '60px',
        paddingBottom: '48px',
        maxWidth: '370px',
        width: '100%',
      }}
    >
      <Text
        as="h2"
        size={32}
        weight="500"
        align="center"
        css={{
          margin: 0,
          color: '#ffffff',
          fontFamily: 'Everett, sans-serif',
          lineHeight: '42px',
          letterSpacing: '-0.01em',
        }}
      >
        {activeTeamInfo.name}
      </Text>
      <Stack direction="vertical" gap={6} css={{ width: '100%' }}>
        <Label style={{ fontSize: 12, marginBottom: 8, color: '#C2C2C2' }}>
          Invite team members
        </Label>
        <Stack as="form" onSubmit={onSubmit} gap={2}>
          <UserSearchInput
            inputValue={inviteValue}
            onInputValueChange={val => {
              setInviteValue(val);
            }}
          />
          <Button
            type="submit"
            variant="secondary"
            css={{ width: 120 }}
            loading={loading}
          >
            Send Invite
          </Button>
        </Stack>

        <List>
          {sortBy(activeTeamInfo.users, u => u.username.toLowerCase()).map(
            user => (
              <ListItem
                key={user.username}
                align="center"
                justify="space-between"
                css={css({ height: 48, paddingX: 0 })}
              >
                <Stack gap={2} align="center">
                  <Avatar user={user} />
                  <Text size={3}>{user.username}</Text>
                </Stack>

                <Text variant="muted" size={3}>
                  {user.id === activeTeamInfo.creatorId ? 'Admin' : 'Member'}
                </Text>
              </ListItem>
            )
          )}

          {sortBy(activeTeamInfo.invitees, u => u.username.toLowerCase()).map(
            user => (
              <ListItem
                key={user.username}
                align="center"
                justify="space-between"
                css={css({ height: 48, paddingX: 0 })}
              >
                <Stack
                  css={css({ flex: 1, width: '100%' })}
                  gap={2}
                  align="center"
                >
                  <Avatar user={user} />
                  <Text size={3}>{user.username}</Text>
                </Stack>

                <Text variant="muted" size={3}>
                  Pending...
                </Text>

                <IconButton
                  title="Revoke Invitation"
                  css={css({ marginLeft: 1 })}
                  size={7}
                  name="cross"
                  onClick={() => {
                    actions.dashboard.revokeTeamInvitation({
                      teamId: activeTeamInfo.id,
                      userId: user.id,
                    });
                  }}
                />
              </ListItem>
            )
          )}
        </List>

        <Label style={{ fontSize: 12, marginBottom: 8, color: '#C2C2C2' }}>
          Copy team invite link
        </Label>
        <Stack gap={2}>
          <Input value={inviteLink} />
          <Button onClick={copyLink} css={{ width: 120 }} variant="secondary">
            {linkCopied ? 'Link Copied!' : 'Copy Invite Link'}
          </Button>
        </Stack>
        <StyledButton
          onClick={() => {
            onComplete();
          }}
        >
          Next
        </StyledButton>
      </Stack>
      <Button
        onClick={() => {
          track('New Team - Skip Team Invite', {
            codesandbox: 'V1',
            event_source: 'UI',
          });
          onComplete();
        }}
        variant="link"
      >
        Skip
      </Button>
    </Stack>
  );
};
